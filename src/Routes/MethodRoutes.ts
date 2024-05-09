import { Router } from "express";
import { body, param } from "express-validator";
import { MethodEOQController } from '../Controllers/MethodEOQController';
import { ProjectValidationExist } from "../Middleware/ProjectValidations";
import { handleInputErrors } from "../Middleware/Validations";
import { MethodBelongToProject, MethodValidationExist } from "../Middleware/MethodValidations";
import { EOQMethodBelongToMethods, MethodEOQValidationExist } from "../Middleware/MethodEOQValidations";
import { MethodCMCController } from "../Controllers/MethodCMCController";

const router = Router()

router.param('projectId', ProjectValidationExist)
router.param('methodId', MethodValidationExist)
router.param('methodId', MethodBelongToProject)
router.param('eoqId', MethodEOQValidationExist)
router.param('eoqId', EOQMethodBelongToMethods)


router.post('/:projectId/methods/eoq',
  body('product').notEmpty().withMessage('Ingresa el nombre del producto'),
  body('costoPedido').notEmpty().withMessage('El Costo de Pedido es obligatorio'),
  body('costoMantenimiento').notEmpty().withMessage('El de Mantenimiento es obligatoria'),
  body('demandaAnual').notEmpty().withMessage('La Demanda Anual es obligatoria'),
  body('description').notEmpty().withMessage('La descripcion es necesaria'),
  handleInputErrors,
  MethodEOQController.createMethodEOQ
)

router.get('/:projectId/methods/eoq',
  MethodEOQController.getAllMethodEOQ
);



// Rutas para el método CMC
router.post('/:projectId/methods/cmc',
  body('product').notEmpty().withMessage('Ingresa el nombre del producto'),
  body('horas').notEmpty().withMessage('La Horas Son Obligatorias'),
  body('MTBF').notEmpty().withMessage('El MTBF es Obligatorio'),
  body('duracionTarea').notEmpty().withMessage('La Duración de la Tarea es obligatoria'),
  body('costoHoraTrabajo').notEmpty().withMessage('El Costo de Horas de Trabajo es Obligatorio'),
  body('repuestos').notEmpty().withMessage('El costo de Repuesto es Obligatorio'),
  body('costoTareasOperacionales').notEmpty().withMessage('El costo de Tareas Operacionales es Obligatorio'),
  body('retrasoLogistico').notEmpty().withMessage('El retraso logistico puede ser 0'),
  body('costoUnitarioParada').notEmpty().withMessage('El Costo Unitario por Parada es obligatoria'),
  body('description').notEmpty().withMessage('La descripcion es necesaria'),
  handleInputErrors,
  MethodCMCController.createMethodCMC
)


export default router
