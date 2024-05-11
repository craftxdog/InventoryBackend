import type { Request, Response } from 'express'
import colors from 'colors'
import Method from '../Models/Methods';
import MethodCMC, { IMethodCMC } from '../Models/MethodCMC';
import Project from '../Models/Projects';


export class MethodCMCController {

  static createMethodCMC = async (req: Request, res: Response) => {
    try {
      const { horas, MTBF, duracionTarea, costoHoraTrabajo, repuestos,
      costoTareasOperacionales, retrasoLogistico, costoUnitarioParada, costosFallaVezUnica } = req.body
      let mtbfValorAbsoluto = 0
      
      const methodCmC: IMethodCMC = new MethodCMC(req.body)

      if (MTBF < 1) {
        mtbfValorAbsoluto = (MTBF * horas);
      } else {
        mtbfValorAbsoluto = MTBF;
      }
      const numeroFallas = horas / mtbfValorAbsoluto
      const roundedNumeroFallas = Math.round(numeroFallas)

      const costoTotal = (roundedNumeroFallas) * ((duracionTarea * costoHoraTrabajo + repuestos + costoTareasOperacionales + retrasoLogistico) +
        (duracionTarea * costoUnitarioParada + costosFallaVezUnica))

      const roundedCostoTotal = Number(costoTotal.toFixed(2))

      methodCmC.MTBF = mtbfValorAbsoluto
      methodCmC.numeroFallas = roundedNumeroFallas
      methodCmC.costoTotal = roundedCostoTotal
      
      let method = await Method.findOne({ project: req.project.id, methodType: 'CMC' })
      if (!method) {
        method = new Method();
        method.methodType = 'CMC';
        method.project = req.project.id;
      }
      method.methodCMC.push(methodCmC.id);
      methodCmC.method = method._id;

      await Promise.allSettled([methodCmC.save(), method.save()])

      const project = await Project.findById(req.project.id);
      if (project && !project.methods.includes(method.id)) {
        project.methods.push(method.id);
        await project.save();
      }

      // const method = new Method()

      // method.methodType = methodCmC.methodType
      // method.methodCMC.push(methodCmC.id)
      // method.project = req.project.id
      // req.project.methods.push(method.id)

      // await Promise.allSettled([, method.save(), req.project.save()])
      res.status(201).send("Método Cáculado")
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }

  }
}


