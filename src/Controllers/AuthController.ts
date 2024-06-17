import { Request, Response } from "express";
import User from "../Models/Users";
import { checkPassword, hashPassword } from "../Utils/Auth";
import Token from "../Models/Token";
import { generateToken } from "../Utils/token";
import { AuthEmail } from "../Utils/Emails/AuthEmail";
import { generateJWT } from "../Utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;
      const userExist = await User.findOne({ email });

      if (userExist) {
        const error = new Error("El usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      const user = new User(req.body);

      user.password = await hashPassword(password);

      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        userName: user.userName,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Cuenta creada, revida tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      console.log(token);
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("Cuenta confirmada Correctamente.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("Usuario no encontrado.");
        return res.status(404).json({ error: error.message });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();

        await token.save();

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          userName: user.userName,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un email con el nuevo código.",
        );
        return res.status(401).json({ error: error.message });
      }

      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("Contraseña Incorrecta.");
        return res.status(401).json({ error: error.message });
      }
      const token = generateJWT({ id: user._id });
      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(409).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("El usuario ya esta confirmado");
        return res.status(403).json({ error: error.message });
      }

      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        userName: user.userName,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Se envio un nuevo token a tu e-mail");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(409).json({ error: error.message });
      }

      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      AuthEmail.sendPasswordResetToken({
        email: user.email,
        userName: user.userName,
        token: token.token,
      });
      res.send("Revisa tu email para las Instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }
      res.send("Token Válido, define tu nuevo password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(req.body.password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("Password modificado correctamente.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static userProfile = async (req: Request, res: Response) => {
    try {
      return res.json(req.user);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
