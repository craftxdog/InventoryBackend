import type { Request, Response, NextFunction } from "express";
import Project, { IProjects } from "../Models/Projects";
import colors from 'colors'

declare global {
  namespace Express {
    interface Request {
      project: IProjects
    }
  }
}

export async function ProjectValidationExist(req: Request, res: Response, next: NextFunction) {

  try {
    const { projectId } = req.params
    const project: IProjects | null = await Project.findById(projectId)

    if (!project) {
      const error = new Error('Project not found')
      return res.status(404).json({ error: error.message })
    }

    req.project = project
    next()
  } catch (error) {
    console.log(colors.cyan.bold(error.message))
  }
}
