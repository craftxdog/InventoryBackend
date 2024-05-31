import type { Request, Response, NextFunction } from "express";
import colors from "colors";
import MethodRI, { IMethodRI } from "../Models/MethodRI";

declare global {
  namespace Express {
    interface Request {
      methodRI: IMethodRI;
    }
  }
}

export async function MethodRIValidationExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { rioId } = req.params;
    const method: IMethodRI | null = await MethodRI.findById(rioId);

    if (!method) {
      const error = new Error("Method RIO not found");
      return res.status(404).json({ error: error.message });
    }

    req.methodRI = method;
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}

export async function RIMethodBelongToMethods(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.methodRI.methods.toString() !== req.methods.id.toString()) {
      const error = Error("Invalid action");
      return res.status(404).json({ error: error.message });
    }
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}
