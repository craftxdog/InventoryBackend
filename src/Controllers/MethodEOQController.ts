import type { Request, Response } from 'express'
import colors from 'colors'
import MethodEOQ, { IMethodEOQ } from '../Models/MethodEOQ'
import Methods from '../Models/Methods';
import Project from '../Models/Projects';


export class MethodEOQController {

  static createMethodEOQ = async (req: Request, res: Response) => {
    try {

      const methodEoQ: IMethodEOQ = new MethodEOQ(req.body);
      const { costoPedido, costoMantenimiento, demandaAnual } = req.body

      const eoq = Math.round(Math.sqrt((2 * demandaAnual * costoPedido) / costoMantenimiento));
      methodEoQ.result = eoq

      methodEoQ.methods = req.methods.id
      req.methods.methodEOQ.push(methodEoQ.id)

      await Promise.allSettled([methodEoQ.save(), req.methods.save()])

      res.status(201).send("Método Cáculado Correctamente.")

    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static getAllMethodsEOQ = async (req: Request, res: Response) => {
    try {

      const methodEOQ = await MethodEOQ.find({ methods: req.methods.id }).populate('methods')
      // console.log(req.methods.id)
      res.status(201).json(methodEOQ)

    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos EOQ, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static getMethodEOQById = async (req: Request, res: Response) => {
    try {
      if (req.methodEOQ.methods.toString() !== req.methods.id) {
        const error = new Error('Acción no válida');
        return res.status(404).json({ error: error.message });
      }
      res.status(201).json(req.methodEOQ)
    } catch (error) {
      console.error(colors.dim.bold(`Error los Métodos EOQ, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static updateMethodEOQById = async (req: Request, res: Response) => {
    try {
      const { eoqId } = req.params
      const methodEOQ = await MethodEOQ.findById(eoqId)
      const { costoPedido, costoMantenimiento, demandaAnual } = req.body

      if (!methodEOQ) {
        const error = new Error('Método no Encontrado')
        return res.status(404).json({ error: error.message })
      }

      const eoq = Math.round(Math.sqrt((2 * demandaAnual * costoPedido) / costoMantenimiento))

      methodEOQ.costoPedido = req.body.costoPedido
      methodEOQ.costoMantenimiento = req.body.costoMantenimiento
      methodEOQ.demandaAnual = req.body.demandaAnual
      methodEOQ.result = eoq

      await methodEOQ.save()

      res.status(201).send('Método EOQ actualizado exitosamente')
    } catch (error) {
      console.error(colors.dim.bold(`Error al actualizar el Método EOQ: ${error}`));
      res.status(500).json({ error: 'Error interno del servidor' });
    }

  }
  static deleteMethodEOQById = async (req: Request, res: Response) => {
    try {
      req.methods.methodEOQ = req.methods.methodEOQ.filter((methods: any) => methods.toString() !== req.methodEOQ.id.toString())
      await Promise.allSettled([req.methodEOQ.deleteOne(), req.methods.save()])
      res.status(201).send("Método Eliminado Correctamente.")
    } catch (error) {
      console.error(colors.dim.bold(`Error al eliminar el Método EOQ: ${error}`));
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}



