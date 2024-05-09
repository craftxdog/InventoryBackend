import type { Request, Response, NextFunction } from 'express'
import MethodEOQ ,{ IMethodEOQ } from '../Models/MethodEOQ'
import colors from 'colors'

declare global {
  namespace Express {
    interface Request {
      methodEOQ: IMethodEOQ
    }
  }
}

export async function MethodEOQValidationExist (req: Request, res: Response, next: NextFunction) {
  try {
    const { eoqId } = req.params
    const methodEOQ: IMethodEOQ | null = await MethodEOQ.findById(eoqId)

    if (!methodEOQ) {
      const error = new Error('Method EOQ not found')
      return res.status(404).json({ error: error.message })
    }

    req.methodEOQ = methodEOQ
    next()
  } catch (error) {
    console.log(colors.cyan.bold(error.message))
  }
}

export async function EOQMethodBelongToMethods (req: Request, res: Response, next: NextFunction) {
  try {
    if (req.methodEOQ.method.toString() !== req.methods.id.toString()) {
      const error = new Error('Invalid action')
      return res.status(404).json({ error: error.message })
    }
    next()
  } catch (error) {
    console.log(colors.cyan.bold(error.message))
  }
}
