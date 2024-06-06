import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import colors from "colors";
import User, { IUser } from "../Models/Users";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("Usuario No Autorizado");
    return res.status(401).json({ error: error.message });
  }

  const [, token] = bearer.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select("_id userName email");
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(500).json({ error: "TOKEN NO VÁLIDO" });
      }
    }
  } catch (error) {
    console.error(colors.dim.bold(`Token no válido, ${error}`));
    res.status(500).json({ error: "TOKEN NO VÁLIDO" });
  }
};
