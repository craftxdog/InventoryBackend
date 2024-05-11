import type { Request, Response } from 'express'
import colors from 'colors'


export class MethodController {

  static getMethodById = async (req: Request, res: Response) => {
    try {
      if (req.methods.project.toString() !== req.project.id) {
        const error = new Error('Acción no válida')
        return res.status(404).json({ error: error.message })
      }
      res.status(201).json(req.methods)
    } catch (error) {
      console.error(colors.red.bold(`Error al Cácular, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

}
