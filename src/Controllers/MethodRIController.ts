import type { Request, Response } from "express";
import colors from "colors";
import MethodRI, { IMethodRI } from "../Models/MethodRI";

export class MethodRIController {
  static createMethodRI = async (req: Request, res: Response) => {
    try {
      const methodRI: IMethodRI = new MethodRI(req.body);
      const {
        demandaAnual,
        cantidadPedido,
        inventarioSeguridad,
        valorSemanas,
        cicloRevision,
      } = req.body;
      // Validar que los valores recibidos sean números
      const demandaAnualNum = Number(demandaAnual);
      const cantidadPedidoNum = Number(cantidadPedido);
      const inventarioSeguridadNum = Number(inventarioSeguridad);
      const valorSemanasNum = Number(valorSemanas);
      const cicloRevisionNum = Number(cicloRevision);

      let inventarioProm = 0;
      let rotacionInv = 0;

      if (cicloRevisionNum === 0 && valorSemanas === 0) {
        inventarioProm = cantidadPedidoNum / 2 + inventarioSeguridadNum;
        rotacionInv = demandaAnualNum / inventarioProm;
      } else {
        inventarioProm =
          (demandaAnualNum * cicloRevisionNum) / 2 + inventarioSeguridadNum;
        rotacionInv = (demandaAnualNum * valorSemanasNum) / inventarioProm;
      }

      rotacionInv = Math.round(rotacionInv);

      methodRI.valorPromedio = inventarioProm;
      methodRI.rotacionInventario = rotacionInv;

      methodRI.methods = req.methods.id;
      req.methods.methodRI.push(methodRI.id);

      await Promise.allSettled([methodRI.save(), req.methods.save()]);
      res.status(201).send("Método Cáculado Correctamente.");
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  static getAllMethodsRI = async (req: Request, res: Response) => {
    try {
      const methodRoI = await MethodRI.find({
        methods: req.methods.id,
      }).populate("methods");

      res.status(201).json(methodRoI);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos ROI, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getMethodRIOById = async (req: Request, res: Response) => {
    try {
      if (req.methodRI.methods.toString() !== req.methods.id) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ error: error.message });
      }
      res.status(201).json(req.methodRI);
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos ROI, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateMethodRIOById = async (req: Request, res: Response) => {
    try {
      const { rioId } = req.params;
      const methodRI = await MethodRI.findById(rioId);
      const {
        demandaAnual,
        cantidadPedido,
        inventarioSeguridad,
        valorSemanas,
        cicloRevision,
      } = req.body;

      if (!methodRI) {
        const error = new Error("Método no Encontrado");
        return res.status(404).json({ error: error.message });
      }

      let inventarioProm = 0;
      let rotacionInv = 0;

      if (cicloRevision === 0) {
        inventarioProm = cantidadPedido / 2 + inventarioSeguridad;
        rotacionInv = demandaAnual / inventarioProm;
      } else {
        inventarioProm =
          (demandaAnual * cicloRevision) / 2 + inventarioSeguridad;
        rotacionInv = (demandaAnual * valorSemanas) / inventarioProm;
      }
      rotacionInv = Math.round(rotacionInv);
      methodRI.demandaAnual = req.body.demandaAnual;
      methodRI.cantidadPedido = req.body.cantidadPedido;
      methodRI.inventarioSeguridad = req.body.inventarioSeguridad;
      methodRI.valorSemanas = req.body.valorSemanas;
      methodRI.cicloRevision = req.body.cicloRevision;
      methodRI.valorPromedio = inventarioProm;
      methodRI.rotacionInventario = rotacionInv;

      await methodRI.save();

      res.status(201).send("Método RIO actualizado exitosamente");
    } catch (error) {
      console.error(
        colors.dim.bold(`Error al actualizar el Método RIO: ${error}`),
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static deleteMethodRIOById = async (req: Request, res: Response) => {
    try {
      req.methods.methodRI = req.methods.methodRI.filter(
        (methods: any) => methods.toString() !== req.methodRI.id.toString(),
      );
      await Promise.allSettled([req.methodRI.deleteOne(), req.methods.save()]);
      res.status(201).send("Método Eliminado Correctamente.");
    } catch (error) {
      console.error(
        colors.dim.bold(`Error al eliminar el Método RIO: ${error}`),
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
