import type { Request, Response } from "express";
import Methods, { IMethods } from "../Models/Methods";
import colors from "colors";

export class MethodsController {
  static createMethod = async (req: Request, res: Response) => {
    try {
      const method: IMethods = new Methods(req.body);
      method.project = req.project.id;

      req.project.methods.push(method.id);
      await Promise.allSettled([method.save(), req.project.save()]);

      res.status(201).send("Método agregado correctamente");
    } catch (error) {
      console.error(colors.red.bold(`Error al Agregar el Método, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getAllMethods = async (req: Request, res: Response) => {
    try {
      const methods = await Methods.find({ project: req.project.id }).populate(
        "project",
      );
      res.status(201).json(methods);
    } catch (error) {
      console.error(colors.red.bold(`Error al Listar los Método, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static getMethodById = async (req: Request, res: Response) => {
    try {
      const { methodId } = req.params;

      if (req.methods.project.toString() !== req.project.id) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ error: error.message });
      }

      const methods = await Methods.findById(methodId)
        .populate("methodEOQ")
        .populate("methodCMC")
        .populate("methodCRP");

      //.populate("methodRI");

      res.status(201).json(methods);
    } catch (error) {
      console.error(colors.red.bold(`Error al Listar el Método, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static updateMethodById = async (req: Request, res: Response) => {
    try {
      const { methodId } = req.params;
      const method = await Methods.findById(methodId);

      if (!method) {
        const error = new Error("Método no Encontrado");
        return res.status(404).json({ error: error.message });
      }

      method.title = req.body.title;
      method.product = req.body.product;
      method.methodType = req.body.methodType;
      method.description = req.body.description;

      await method.save();
      res.status(201).send("Método Actualizado correctamente.");
    } catch (error) {
      console.error(colors.red.bold(`Error al Actualizar el Método, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  static deleteMethodById = async (req: Request, res: Response) => {
    try {
      req.project.methods = req.project.methods.filter(
        (method: any) => method.toString() !== req.methods.id.toString(),
      );
      await Promise.allSettled([req.methods.deleteOne(), req.project.save()]);
      res.status(201).send("Método Eliminado Correctamente.");
    } catch (error) {
      console.error(colors.red.bold(`Error al Actualizar el Método, ${error}`));
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
