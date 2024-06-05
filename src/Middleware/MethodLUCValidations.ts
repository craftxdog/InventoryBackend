import type { Request, Response, NextFunction } from "express";
import colors from "colors";
import MethodLUC, { IMethodLUC } from "../Models/MethodLUC";

declare global {
  namespace Express {
    interface Request {
      methodLUC: IMethodLUC;
    }
  }
}

export async function MethodLUCValidationExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { lucId } = req.params;
    const method: IMethodLUC | null = await MethodLUC.findById(lucId);

    if (!method) {
      const error = new Error("Method LUC not found");
      return res.status(404).json({ error: error.message });
    }

    req.methodLUC = method;
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}

export async function LUCMethodBelongToMethods(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.methodLUC.methods.toString() !== req.methods.id.toString()) {
      const error = Error("Invalid action");
      return res.status(404).json({ error: error.message });
    }
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}
