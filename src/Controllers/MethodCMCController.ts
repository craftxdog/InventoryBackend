import type { Request, Response } from 'express'
import colors from 'colors'
import Methods from '../Models/Methods';
import MethodCMC, { IMethodCMC } from '../Models/MethodCMC';
import Project from '../Models/Projects';


export class MethodCMCController {

  static createMethodCMC = async (req: Request, res: Response) => {
    try {
      const { horas, MTBF, duracionTarea, costoHoraTrabajo, repuestos,
        costoTareasOperacionales, retrasoLogistico, costoUnitarioParada, costosFallaVezUnica } = req.body

      let mtbfValorAbsoluto = MTBF < 1 ? MTBF * horas : MTBF;


      const numeroFallas = horas / mtbfValorAbsoluto;
      const roundedNumeroFallas = Math.round(numeroFallas);

      const costoTotal = roundedNumeroFallas * ((duracionTarea * costoHoraTrabajo + repuestos + costoTareasOperacionales + retrasoLogistico) +
        (duracionTarea * costoUnitarioParada + costosFallaVezUnica));

      const roundedCostoTotal = Number(costoTotal.toFixed(2));

      const methodCmCData: Partial<IMethodCMC> = {
        methodName: 'Costo de Mantenimiento Correctivo',
        methodType: 'CMC',
        horas,
        MTBF: mtbfValorAbsoluto,
        duracionTarea,
        costoHoraTrabajo,
        repuestos,
        costoTareasOperacionales,
        retrasoLogistico,
        costoUnitarioParada,
        costosFallaVezUnica,
        numeroFallas: roundedNumeroFallas,
        costoTotal: roundedCostoTotal
      };
      const methodCmC = new MethodCMC(methodCmCData);
      await methodCmC.save();

      let method = await Methods.findOne({ project: req.project.id, methodType: 'CMC' });
      if (!method) {
        method = new Methods({ project: req.project.id, methodCMC: [] });
      }

      method.methodCMC.push(methodCmC);
      await method.save();

      const project = await Project.findById(req.project.id);
      if (project && !project.methods.includes(method.id)) {
        project.methods.push(method.id);
        await project.save();
      } res.status(201).send("Método Cáculado")
    } catch (error) {
      console.error(colors.dim.bold(`Error al Cácular, ${error}`))
      res.status(500).json({ error: "Error interno del servidor" })
    }

  }
}


