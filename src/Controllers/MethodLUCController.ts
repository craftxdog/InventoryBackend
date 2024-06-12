import type { Request, Response } from "express";
import colors from "colors";
import MethodLUC from "../Models/MethodLUC";

export class MethodLUCController {
  static createMethodLUC = async (req: Request, res: Response) => {
    try {
      res.status(201).send("Método LUC Cáculado.");
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getAllMethodsLUC = async (req: Request, res: Response) => {
    try {
      const methodLUC = await MethodLUC.find({
        methods: req.methods.id,
      }).populate("methods");
      res.status(201).json(methodLUC);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos LUC, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getMethodLUCById = async (req: Request, res: Response) => {
    try {
      if (req.methodLUC.methods.toString() !== req.methods.id) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ error: error.message });
      }
      res.status(201).json(req.methodLUC);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos EOQ, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
