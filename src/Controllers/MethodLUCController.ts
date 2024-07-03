import type { Request, Response } from "express";
import colors from "colors";
import MethodLUC from "../Models/MethodLUC";

export class MethodLUCController {
  static createMethodLUC = async (req: Request, res: Response) => {
    try {
      const { semanas, requerimientoBruto, S, K } = req.body;

      const semanasNum = Number(semanas);

      const requerimientos = requerimientoBruto;

      if (!semanasNum || typeof semanasNum !== "number" || semanasNum <= 0) {
        return res
          .status(400)
          .json({ error: "El número de semanas debe ser un número positivo" });
      }
      if (
        !requerimientos ||
        !Array.isArray(requerimientos) ||
        requerimientos.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Datos de requerimientos incorrectos o incompletos" });
      }
      // Calcular LUC
      // Arrays para almacenar resultados
      const unidades: number[] = [];
      const kValues: number[] = [];
      const costosTotales: number[] = [];
      const costosUnitariosTotales: number[] = [];
      const peridos: number[] = [];

      // let costoTotalAnterior = 0;
      let unidadesTotales = 0;
      let sum = 0;

      for (let i = 0; i < semanasNum; i++) {
        // Validar que el requerimiento sea un número válido
        const requerimiento = Number(requerimientos[i]) || 0;
        if (isNaN(requerimiento) || requerimiento < 0) {
          return res
            .status(400)
            .json({ error: "Requerimiento bruto inválido" });
        }

        // Calcular unidades acumuladas
        unidadesTotales += requerimiento;
        unidades.push(unidadesTotales);

        sum += 1;
        peridos.push(sum);

        // Calcular K
        const k = i > 0 ? requerimiento * i * K : 0;
        kValues.push(k);

        // Calcular costo total
        const costoTotal = i === 0 ? S : costosTotales[i - 1] + k;
        costosTotales.push(costoTotal);

        // Calcular costo unitario total
        const costoUnitarioTotal = costoTotal / unidadesTotales;
        costosUnitariosTotales.push(costoUnitarioTotal);
      }

      const methodLuC = new MethodLUC({
        semanas,
        unidades: unidades,
        periodo: peridos,
        S: S,
        K: K,
        kvalores: kValues,
        costoTotal: costosTotales,
        costoUnitarioTotal: costosUnitariosTotales,
      });
      methodLuC.requerimientoBruto = req.body.requerimientoBruto;
      methodLuC.methods = req.methods.id;
      req.methods.methodLUC.push(methodLuC.id);

      await Promise.allSettled([methodLuC.save(), req.methods.save()]);

      // Preparar respuesta
      /*
      const resultado = {
        periodos: semanas,
        unidades,
        S,
        kValues,
        costosTotales,
        costosUnitariosTotales,
      };
      */

      // Enviar respuesta al cliente
      res.status(201).send("Método Cálculado Correctamente");
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
