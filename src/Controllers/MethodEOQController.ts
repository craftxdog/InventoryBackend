import type { Request, Response } from 'express'
import colors from 'colors'
import MethodEOQ, { IMethodEOQ } from '../Models/MethodEOQ'
import Method from '../Models/Methods';


export class MethodEOQController {

  static createMethodEOQ = async (req: Request, res: Response) => {
    try {
      const { costoPedido, costoMantenimiento, demandaAnual } = req.body

      const methodEoQ: IMethodEOQ = new MethodEOQ(req.body);
      const eoq = Math.round(Math.sqrt((2 * demandaAnual * costoPedido) / costoMantenimiento));

      methodEoQ.result = eoq

      const method = new Method()
      method.methodType = methodEoQ.methodType
      method.methodEOQ.push(methodEoQ.id)
      method.project = req.project.id
      req.project.methods.push(method.id)

      await Promise.allSettled([methodEoQ.save(), method.save(), req.project.save()])
      res.status(201).send("Método Cáculado")

    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static getAllMethodEOQ = async (req: Request, res: Response) => {
    try {
      const methodEoQ = await MethodEOQ.find({ methodType: 'EOQ' }).populate('EOQ')
      res.status(201).json(methodEoQ)
    } catch (error) {
      console.error(colors.red.bold(`Error al Cácular, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }
}



