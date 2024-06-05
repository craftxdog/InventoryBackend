import type { Request, Response } from "express";
import colors from "colors";
import MethodLUC from "../Models/MethodLUC";

export class MethodLUCController {
  static createMethodLUC = async (req: Request, res: Response) => {
    try {
      const { semanas, S, K, LT, requerimientoBruto } = req.body;

      let unidades = 0;
      let costoTotal = S + K;
      let k = K;
      const resultados = [];

      let periodos = "";
      let inicioCiclo = 0;

      for (let i = 1; i <= semanas; i++) {
        if ((i - 1) % 5 === 0) {
          inicioCiclo = i - 1;
          unidades = requerimientoBruto[inicioCiclo];
          periodos = `${i}`;
        } else {
          unidades += requerimientoBruto[i - 1];
          periodos += `-${i}`;
        }
        console.log(periodos, unidades);
      }

      /*
      const costoUnitarioTotal = costoTotal / unidades;
      const requerimientoBruto = 0;
      const recepcionPlaneada = i >= LT ? unidades : 0;

      const resultado = {
        periodo: i,
        unidades,
        S,
        K: k,
        costoTotal,
        costoUnitarioTotal,
        requerimientoBruto,
        recepcionPlaneada,
      };

      unidades++;
      resultados.push(resultado);
      const methodLuC = new MethodLUC(resultado);
      methodLuC.methods = req.methods._id;
      req.methods.methodLUC.push(methodLuC._id);
      await Promise.allSettled([methodLuC.save(), req.methods.save()]);
*/
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
