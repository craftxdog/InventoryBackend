import type { Request, Response } from 'express'
import Project, { IProjects } from '../Models/Projects'
import colors from 'colors';

export class ProjectController {

  static createProject = async (req: Request, res: Response) => {
    try {

      const project: IProjects = new Project(req.body)
      await project.save()

      res.status(201).send("Proyecto agregado correctamente")
    } catch (error) {
      console.error(colors.dim.bold(`Error al agregar el proyecto: ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static findAllProjects = async (req: Request, res: Response) => {
    try {

      const project: IProjects[] = await Project.find({})

      if (!project) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({ error: error.message })
      }
      res.json(project);
    } catch (error) {
      console.error(colors.dim.bold(`Error al buscar proyectos:, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static findProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      const project: IProjects | null = await Project.findById(id).populate('methods')

      if (!project) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({ error: error.message })
      }

      res.json(project)

    } catch (error) {
      console.error(colors.dim.bold(`Error al buscar proyectos:, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id)

      if (!project) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({ error: error.message })
      }

      project.projectName = req.body.projectName
      project.clientName = req.body.clientName
      project.description = req.body.description

      await project.save()
      res.status(201).send("Proyecto actualizado correctamente")
    } catch (error) {
      console.error(colors.dim.bold(`Error al buscar proyectos:, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  static deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({ error: error.message })
      }

      await project.deleteOne()
      res.status(201).send("Proyecto Eliminado Correctamente")
    } catch (error) {
      console.error(colors.dim.bold(`Error al buscar proyectos:, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }
}
