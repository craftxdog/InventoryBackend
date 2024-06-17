import type { Request, Response } from "express";
import colors from "colors";
import MethodLUC from "../Models/MethodLUC";

export class MethodLUCController {
  static createMethodLUC = async (req: Request, res: Response) => {
    const S = 6.5;
    const K = 0.03;
    try {
      const { semanas, requerimientos } = req.body;
      // Validar que se proporcionaron las semanas y los requerimientos
      if (
        !semanas ||
        !Array.isArray(semanas) ||
        semanas.length !== requerimientos.length
      ) {
        return res
          .status(400)
          .json({ error: "Datos de semanas incorrectos o incompletos" });
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
      const costosTotales: number[] = [];
      let costoTotalAnterior = 0;
      let unidadesTotales = 0;

      for (let i = 0; i < requerimientos.length; i++) {
        // Validar que el requerimiento sea un número válido
        const requerimiento = Number(requerimientos[i]);
        if (isNaN(requerimiento) || requerimiento < 0) {
          return res
            .status(400)
            .json({ error: "Requerimiento bruto inválido" });
        }

        // Calcular K
        const k = i > 0 ? requerimiento * i * K : 0;

        // Calcular costo total
        const costoTotal = costoTotalAnterior + k;

        // Actualizar costo total anterior
        costoTotalAnterior = costoTotal;

        // Calcular unidades totales
        unidadesTotales += requerimiento;

        // Guardar costo total en array
        costosTotales.push(costoTotal);
      }

      // Calcular costo unitario total por unidades
      const costoUnitarioTotal = costoTotalAnterior / unidadesTotales;

      // Preparar respuesta
      const resultado = {
        costosTotales,
        costoUnitarioTotal,
      };

      // Enviar respuesta al cliente
      res.json(resultado);
      //res.status(201).send("Método LUC Cáculado.");
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
