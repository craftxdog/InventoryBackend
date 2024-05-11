import type { Request, Response, NextFunction } from 'express'
import Method, { IMethods } from '../Models/Methods'
import colors from 'colors'

declare global {
  namespace Express {
    interface Request {
      methods: IMethods
    }
  }
}

export async function MethodValidationExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { methodId } = req.params
    const method: IMethods | null = await Method.findById(methodId)

    if (!method) {
      const error = new Error('Main Method not found')
      return res.status(404).json({ error: error.message })
    }

    req.methods = method
    next()
  } catch (error) {
    console.log(colors.cyan.bold(error.message))
  }

}

export async function MethodBelongToProject(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.methods.project.toString() !== req.project.id.toString()) {
      const error = Error ('Invalid action')
      return res.status(404).json({ error: error.message })
    }
    next()
  } catch (error) {
    console.log(colors.cyan.bold(error.message))
  }
} 
