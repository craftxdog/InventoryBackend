import { Router } from "express";
import { body, param } from "express-validator";
import { MethodEOQController } from '../Controllers/MethodEOQController';
import { ProjectValidationExist } from "../Middleware/ProjectValidations";
import { handleInputErrors } from "../Middleware/Validations";
import { MethodBelongToProject, MethodValidationExist } from "../Middleware/MethodValidations";
import { EOQMethodBelongToMethods, MethodEOQValidationExist } from "../Middleware/MethodEOQValidations";
import { MethodCMCController } from "../Controllers/MethodCMCController";
import { MethodsController } from "../Controllers/MethodsController";

const router = Router()

router.param('projectId', ProjectValidationExist)
router.param('methodId', MethodValidationExist)
router.param('methodId', MethodBelongToProject)
router.param('eoqId', MethodEOQValidationExist)
router.param('eoqId', EOQMethodBelongToMethods)

/*
 * Inicio con las rutas principales de Methods.
*/

router.post('/:projectId/methods', 
  body('title').notEmpty().withMessage('Escribe un titulo para el método'),
  body('methodType').notEmpty().withMessage('Indique el tipo de Método'),
  body('product').notEmpty().withMessage('Ingresa el nombre del producto'),
  body('description').notEmpty().withMessage('Escribe una descripción'),
  handleInputErrors,
  MethodsController.createMethod
);

router.get('/:projectId/methods',
  MethodsController.getAllMethods
);

router.get('/:projectId/methods/:methodId',
  param('methodId').isMongoId().withMessage('ID No Válido'),
  handleInputErrors,
  MethodsController.getMethodById
);

router.put('/:projectId/methods/:methodId',
  param('methodId').isMongoId().withMessage('ID No Válido'),
  body('title').notEmpty().withMessage('Escribe un titulo para el método'),
  body('methodType').notEmpty().withMessage('Indique el tipo de Método'),
  body('product').notEmpty().withMessage('Ingresa el nombre del producto'),
  body('description').notEmpty().withMessage('Escribe una descripción'),
  handleInputErrors,
  MethodsController.updateMethodById
);

router.delete('/:projectId/methods/:methodId',
  param('methodId').isMongoId().withMessage('ID No Válido'),
  handleInputErrors,
  MethodsController.deleteMethodById
);

/*
 * Terminamos con las rutas principales de Methods.
 * Ahora continuaremos con las rutas para el Método EOQ.
*/

router.post('/:projectId/methods/:methodId/eoq',
  param('methodId').isMongoId().withMessage('ID No Valido'),
  body('costoPedido').notEmpty().withMessage('El Costo de Pedido es obligatorio'),
  body('costoMantenimiento').notEmpty().withMessage('El de Mantenimiento es obligatoria'),
  body('demandaAnual').notEmpty().withMessage('La Demanda Anual es obligatoria'),
  handleInputErrors,
  MethodEOQController.createMethodEOQ
)

router.get('/:projectId/methods/:methodId/eoq',
  param('methodId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  MethodEOQController.getAllMethodsEOQ
);

router.get('/:projectId/methods/:methodId/eoq/:eoqId',
  param('eoqId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  MethodEOQController.getMethodEOQById
);

router.put('/:projectId/methods/:methodId/eoq/:eoqId',
  param('eoqId').isMongoId().withMessage('ID no válido'),
  body('costoPedido').notEmpty().withMessage('El Costo de Pedido es obligatorio'),
  body('costoMantenimiento').notEmpty().withMessage('El de Mantenimiento es obligatoria'),
  body('demandaAnual').notEmpty().withMessage('La Demanda Anual es obligatoria'),
  handleInputErrors,
  MethodEOQController.updateMethodEOQById 
)

router.delete('/:projectId/methods/:methodId/eoq/:eoqId',
  param('eoqId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  MethodEOQController.deleteMethodEOQById 
)

/*
 * Terminamos con las rutas del Método EOQ.
 * Ahora continuaremos con las rutas para el Método CMC.
*/

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
