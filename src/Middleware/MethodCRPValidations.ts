import type { Request, Response, NextFunction } from "express";
import MethodCRP, { IMethodCRP } from "../Models/MethodCRP";
import colors from "colors";

declare global {
  namespace Express {
    interface Request {
      methodCRP: IMethodCRP;
    }
  }
}

export async function MethodCRPValidationExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { crpId } = req.params;
    const method: IMethodCRP | null = await MethodCRP.findById(crpId);

    if (!method) {
      const error = new Error("Method CRP not found");
      return res.status(404).json({ error: error.message });
    }

    req.methodCRP = method;
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}

export async function CRPMethodBelongToMethods(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.methodCRP.methods.toString() !== req.methods.id.toString()) {
      const error = Error("Invalid action");
      return res.status(404).json({ error: error.message });
    }
    next();
  } catch (error) {
    console.log(colors.cyan.bold(error.message));
  }
}
