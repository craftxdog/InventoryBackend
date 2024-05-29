import type { Request, Response } from "express";
import colors from "colors";
import MethodCMC, { IMethodCMC } from "../Models/MethodCMC";

export class MethodCMCController {
  static createMethodCMC = async (req: Request, res: Response) => {
    try {
      const {
        horas,
        MTBF,
        duracionTarea,
        costoHoraTrabajo,
        repuestos,
        costoTareasOperacionales,
        retrasoLogistico,
        costoUnitarioParada,
        costosFallaVezUnica,
      } = req.body;

      let mtbfValorAbsoluto = MTBF < 1 ? MTBF * horas : MTBF;

      const numeroFallas = horas / mtbfValorAbsoluto;
      const roundedNumeroFallas = Math.round(numeroFallas);

      const costoTotal =
        roundedNumeroFallas *
        (duracionTarea * costoHoraTrabajo +
          repuestos +
          costoTareasOperacionales +
          retrasoLogistico +
          (duracionTarea * costoUnitarioParada + costosFallaVezUnica));

      const roundedCostoTotal = Number(costoTotal);

      const methodCmCData = {
        methodName: "Costo de Mantenimiento Correctivo",
        methodType: "CMC",
        horas,
        MTBF: mtbfValorAbsoluto,
        duracionTarea,
        costoHoraTrabajo,
        repuestos,
        costoTareasOperacionales,
        retrasoLogistico,
        costoUnitarioParada,
        costosFallaVezUnica,
        numeroFallas: roundedNumeroFallas,
        costoTotal: roundedCostoTotal,
      };

      const methodCmC = new MethodCMC(methodCmCData);
      methodCmC.methods = req.methods._id;

      req.methods.methodCMC.push(methodCmC._id);
      await Promise.allSettled([methodCmC.save(), req.methods.save()]);

      res.status(201).send("Método Cáculado");
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getAllMethodsCMC = async (req: Request, res: Response) => {
    try {
      const methodCMC = await MethodCMC.find({
        methods: req.methods.id,
      }).populate("methods");
      console.log(req.methods.id);
      res.status(201).json(methodCMC);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos CMC, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getMethodCMCById = async (req: Request, res: Response) => {
    try {
      if (req.methodCMC.methods.toString() !== req.methods.id) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ error: error.message });
      }
      res.status(201).json(req.methodCMC);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos EOQ, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateMethodCMC = async (req: Request, res: Response) => {
    try {
      const { cmcId } = req.params;
      const methodCMC = await MethodCMC.findById(cmcId);
      const {
        horas,
        MTBF,
        duracionTarea,
        costoHoraTrabajo,
        repuestos,
        costoTareasOperacionales,
        retrasoLogistico,
        costoUnitarioParada,
        costosFallaVezUnica,
      } = req.body;

      if (!methodCMC) {
        const error = new Error("Método no Encontrado");
        return res.status(404).json({ error: error.message });
      }

      let mtbfValorAbsoluto = MTBF < 1 ? MTBF * horas : MTBF;

      const numeroFallas = horas / mtbfValorAbsoluto;
      const roundedNumeroFallas = Math.round(numeroFallas);

      const costoTotal =
        roundedNumeroFallas *
        (duracionTarea * costoHoraTrabajo +
          repuestos +
          costoTareasOperacionales +
          retrasoLogistico +
          (duracionTarea * costoUnitarioParada + costosFallaVezUnica));

      const roundedCostoTotal = Number(costoTotal.toFixed(2));

      (methodCMC.horas = req.body.horas),
        (methodCMC.MTBF = mtbfValorAbsoluto),
        (methodCMC.duracionTarea = req.body.duracionTarea),
        (methodCMC.costoHoraTrabajo = req.body.costoHoraTrabajo),
        (methodCMC.repuestos = req.body.repuestos),
        (methodCMC.costoTareasOperacionales =
          req.body.costoTareasOperacionales),
        (methodCMC.retrasoLogistico = req.body.retrasoLogistico),
        (methodCMC.costoUnitarioParada = req.body.costoUnitarioParada),
        (methodCMC.costosFallaVezUnica = req.body.costosFallaVezUnica),
        (methodCMC.numeroFallas = roundedNumeroFallas),
        (methodCMC.costoTotal = roundedCostoTotal),
        await methodCMC.save();
      res.status(201).send("Método CMC Actualizado Correctamente.");
    } catch (error) {
      console.error(colors.dim.bold(`Error al Actualizar el método, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  static deleteMethodCMCById = async (req: Request, res: Response) => {
    try {
      req.methods.methodCMC = req.methods.methodCMC.filter(
        (methods: any) => methods.toString() !== req.methodCMC._id.toString(),
      );
      await Promise.allSettled([req.methodCMC.deleteOne(), req.methods.save()]);
      res.status(201).send("Método Eliminado Correctamente.");
    } catch (error) {
      console.error(
        colors.dim.bold(`Error al eliminar el Método CMC: ${error}`),
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
