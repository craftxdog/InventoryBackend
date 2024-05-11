import type { Request, Response } from 'express'
import colors from 'colors'
import MethodEOQ, { IMethodEOQ } from '../Models/MethodEOQ'
import Method from '../Models/Methods';
import Project from '../Models/Projects';


export class MethodEOQController {

  static createMethodEOQ = async (req: Request, res: Response) => {
    try {
      const { costoPedido, costoMantenimiento, demandaAnual } = req.body

      const methodEoQ: IMethodEOQ = new MethodEOQ(req.body);
      const eoq = Math.round(Math.sqrt((2 * demandaAnual * costoPedido) / costoMantenimiento));
      methodEoQ.result = eoq

      let method = await Method.findOne({ project: req.project.id, methodType: 'EOQ' })

      if (!method) {
        method = new Method();
        method.methodType = 'EOQ';
        method.project = req.project.id;
      }
      method.methodEOQ.push(methodEoQ.id);
      methodEoQ.method = method._id;

      await Promise.allSettled([methodEoQ.save(), method.save()])

      const project = await Project.findById(req.project.id);
      if (project && !project.methods.includes(method.id)) {
        project.methods.push(method.id);
        await project.save();
      }

      res.status(201).send("Método Cáculado")
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static getMethodEOQById = async (req: Request, res: Response) => {
    try {
      if (req.methodEOQ.method.toString() !== req.methods.id) {
        const error = new Error('Acción no válida');
        return res.status(404).json({ error: error.message });
      }
      res.json(req.methodEOQ);
    } catch (error) {
      console.error(colors.dim.bold(`Error al Obtener el Método, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static updateMethodEOQ = async (req: Request, res: Response) => {
    try {
      const { eoqId } = req.params
      const { costoPedido, costoMantenimiento, demandaAnual } = req.body

      const methodEOQ = await MethodEOQ.findById(eoqId)
      const eoq = Math.round(Math.sqrt((2 * demandaAnual * costoPedido) / costoMantenimiento))

      methodEOQ.costoPedido = req.methodEOQ.costoPedido
      methodEOQ.costoMantenimiento = req.methodEOQ.costoMantenimiento
      methodEOQ.demandaAnual = req.methodEOQ.demandaAnual
      methodEOQ.result = eoq

      await methodEOQ.save()

      res.status(200).json({ message: 'Método EOQ actualizado exitosamente', methodEOQ })
    } catch (error) {
      console.error(colors.dim.bold(`Error al actualizar el Método EOQ: ${error}`));
      res.status(500).json({ error: 'Error interno del servidor' });
    }

  }
  static deleteMethodEOQ = async (req: Request, res: Response) => {
    try {
      const { eoqId } = req.params;
      const methodEOQ = await MethodEOQ.findById(eoqId);

      await methodEOQ.deleteOne();

      const method = await Method.findOne({ project: req.project.id, methodType: 'EOQ' });
      if (method) {
        method.methodEOQ = method.methodEOQ.filter((methodId: any) => methodId.toString() !== eoqId);
      }
      
      // Actualiza el proyecto para eliminar el método general EOQ si no tiene ningún método asociado

      const project = await Project.findById(req.project.id);
      if (project) {
        project.methods = project.methods.filter((method: any) => method.toString() !== req.methods.id.toString());
      }

      await Promise.allSettled([methodEOQ.deleteOne(), method.save(), project.save()])
      res.status(200).json({ message: 'Método EOQ eliminado exitosamente' });
    } catch (error) {
      console.error(colors.dim.bold(`Error al eliminar el Método EOQ: ${error}`));
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}



