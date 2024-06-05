import type { Request, Response } from "express";
import MethodCRP, { IMethodCRP } from "../Models/MethodCRP";
import colors from "colors";

export class MethodCRPController {
  static createMethodCRP = async (req: Request, res: Response) => {
    try {
      const methodCrP: IMethodCRP = new MethodCRP(req.body);
      const { tasaDemanda, tiempoVuelta, tamanoRecipiente } = req.body;

      const tasaDemandaNum = Number(tasaDemanda);
      const tiempoVueltaNum = Number(tiempoVuelta);
      const tamanoRecipienteNum = Number(tamanoRecipiente);

      const n = Math.round(
        (tasaDemandaNum * tiempoVueltaNum) / (60 * tamanoRecipienteNum),
      );
      const invMax = Math.round(n * tamanoRecipienteNum);

      methodCrP.cantidadRecipiente = n;
      methodCrP.invenMax = invMax;

      methodCrP.methods = req.methods.id;
      req.methods.methodCRP.push(methodCrP.id);
      await Promise.allSettled([methodCrP.save(), req.methods.save()]);
      res.status(201).send("Método Cáculado Correctamente.");
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getAllMethodsCRP = async (req: Request, res: Response) => {
    try {
      const methodCRP = await MethodCRP.find({
        methods: req.methods.id,
      }).populate("methods");
      res.status(201).json(methodCRP);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos CRP, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getMethodCRPById = async (req: Request, res: Response) => {
    try {
      if (req.methodCRP.methods.toString() !== req.methods.id) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ error: error.message });
      }
      res.status(201).json(req.methodCRP);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos EOQ, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateMethodCRPById = async (req: Request, res: Response) => {
    try {
      const methodCrP: IMethodCRP = new MethodCRP(req.body);
      const { tasaDemanda, tiempoVuelta, tamanoRecipiente } = req.body;

      const n = (tasaDemanda * tiempoVuelta) / (60 * tamanoRecipiente);
      const invMax = tamanoRecipiente * n;

      console.log(invMax);

      methodCrP.cantidadRecipiente = Math.ceil(n);
      methodCrP.invenMax = Math.ceil(invMax);

      methodCrP.methods = req.methods.id;
      req.methods.methodCRP.push(methodCrP.id);
      await Promise.allSettled([methodCrP.save(), req.methods.save()]);
      res.status(201).send("Método Cáculado Correctamente.");
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
