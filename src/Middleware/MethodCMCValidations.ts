import type { Request, Response, NextFunction } from "express";
import MethodCMC, { IMethodCMC } from "../Models/MethodCMC";
import colors from "colors";

declare global {
  namespace Express {
    interface Request {
      methodCMC: IMethodCMC;
    }
  }
}

export async function MethodCMCValidationExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { cmcId } = req.params;
    const method: IMethodCMC | null = await MethodCMC.findById(cmcId);

    if (!method) {
      const error = new Error("Method CMC not found");
      return res.status(404).json({ error: error.message });
    }

    req.methodCMC = method;
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}

export async function CMCMethodBelongToMethods(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.methodCMC.methods.toString() !== req.methods.id.toString()) {
      const error = Error("Invalid action");
      return res.status(404).json({ error: error.message });
    }
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}
