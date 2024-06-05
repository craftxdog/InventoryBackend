import { Router } from "express";
import { body, param } from "express-validator";
import { MethodEOQController } from "../Controllers/MethodEOQController";
import { ProjectValidationExist } from "../Middleware/ProjectValidations";
import { handleInputErrors } from "../Middleware/Validations";
import {
  MethodBelongToProject,
  MethodValidationExist,
} from "../Middleware/MethodValidations";
import {
  EOQMethodBelongToMethods,
  MethodEOQValidationExist,
} from "../Middleware/MethodEOQValidations";
import { MethodCMCController } from "../Controllers/MethodCMCController";
import { MethodsController } from "../Controllers/MethodsController";
import {
  CMCMethodBelongToMethods,
  MethodCMCValidationExist,
} from "../Middleware/MethodCMCValidations";
import {
  CRPMethodBelongToMethods,
  MethodCRPValidationExist,
} from "../Middleware/MethodCRPValidations";
import { MethodCRPController } from "../Controllers/MethodCRPController";
import {
  LUCMethodBelongToMethods,
  MethodLUCValidationExist,
} from "../Middleware/MethodLUCValidations";
import { MethodLUCController } from "../Controllers/MethodLUCController";
import {
  MethodRIValidationExist,
  RIMethodBelongToMethods,
} from "../Middleware/MethodRIValidations";
import { MethodRIController } from "../Controllers/MethodRIController";

const router = Router();

router.param("projectId", ProjectValidationExist);
router.param("methodId", MethodValidationExist);
router.param("methodId", MethodBelongToProject);
router.param("eoqId", MethodEOQValidationExist);
router.param("eoqId", EOQMethodBelongToMethods);
router.param("cmcId", MethodCMCValidationExist);
router.param("cmcId", CMCMethodBelongToMethods);
router.param("crpId", MethodCRPValidationExist);
router.param("crpId", CRPMethodBelongToMethods);
router.param("lucId", MethodLUCValidationExist);
router.param("lucId", LUCMethodBelongToMethods);
router.param("rioId", MethodRIValidationExist);
router.param("rioId", RIMethodBelongToMethods);

/*
 * Inicio con las rutas principales de Methods.
 */

router.post(
  "/:projectId/methods",
  body("title").notEmpty().withMessage("Escribe un titulo para el método"),
  body("methodType").notEmpty().withMessage("Indique el tipo de Método"),
  body("product").notEmpty().withMessage("Ingresa el nombre del producto"),
  body("description").notEmpty().withMessage("Escribe una descripción"),
  handleInputErrors,
  MethodsController.createMethod,
);

router.get("/:projectId/methods", MethodsController.getAllMethods);

router.get(
  "/:projectId/methods/:methodId",
  param("methodId").isMongoId().withMessage("ID No Válido"),
  handleInputErrors,
  MethodsController.getMethodById,
);

router.put(
  "/:projectId/methods/:methodId",
  param("methodId").isMongoId().withMessage("ID No Válido"),
  body("title").notEmpty().withMessage("Escribe un titulo para el método"),
  body("methodType").notEmpty().withMessage("Indique el tipo de Método"),
  body("product").notEmpty().withMessage("Ingresa el nombre del producto"),
  body("description").notEmpty().withMessage("Escribe una descripción"),
  handleInputErrors,
  MethodsController.updateMethodById,
);

router.delete(
  "/:projectId/methods/:methodId",
  param("methodId").isMongoId().withMessage("ID No Válido"),
  handleInputErrors,
  MethodsController.deleteMethodById,
);

/*
 * Terminamos con las rutas principales de Methods.
 * Ahora continuaremos con las rutas para el Método EOQ.
 */

router.post(
  "/:projectId/methods/:methodId/eoq",
  param("methodId").isMongoId().withMessage("ID No Valido"),
  body("costoPedido")
    .notEmpty()
    .withMessage("El Costo de Pedido es obligatorio"),
  body("costoMantenimiento")
    .notEmpty()
    .withMessage("El de Mantenimiento es obligatoria"),
  body("demandaAnual")
    .notEmpty()
    .withMessage("La Demanda Anual es obligatoria"),
  handleInputErrors,
  MethodEOQController.createMethodEOQ,
);

router.get(
  "/:projectId/methods/:methodId/eoq",
  param("methodId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodEOQController.getAllMethodsEOQ,
);

router.get(
  "/:projectId/methods/:methodId/eoq/:eoqId",
  param("eoqId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodEOQController.getMethodEOQById,
);

router.put(
  "/:projectId/methods/:methodId/eoq/:eoqId",
  param("eoqId").isMongoId().withMessage("ID no válido"),
  body("costoPedido")
    .notEmpty()
    .withMessage("El Costo de Pedido es obligatorio"),
  body("costoMantenimiento")
    .notEmpty()
    .withMessage("El de Mantenimiento es obligatoria"),
  body("demandaAnual")
    .notEmpty()
    .withMessage("La Demanda Anual es obligatoria"),
  handleInputErrors,
  MethodEOQController.updateMethodEOQById,
);

router.delete(
  "/:projectId/methods/:methodId/eoq/:eoqId",
  param("eoqId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodEOQController.deleteMethodEOQById,
);

/*
 * Terminamos con las rutas del Método EOQ.
 * Ahora continuaremos con las rutas para el Método CMC.
 */

router.post(
  "/:projectId/methods/:methodId/cmc",
  body("horas").notEmpty().withMessage("La Horas Son Obligatorias"),
  body("MTBF").notEmpty().withMessage("El MTBF es Obligatorio"),
  body("duracionTarea")
    .notEmpty()
    .withMessage("La Duración de la Tarea es obligatoria"),
  body("costoHoraTrabajo")
    .notEmpty()
    .withMessage("El Costo de Horas de Trabajo es Obligatorio"),
  body("repuestos")
    .notEmpty()
    .withMessage("El costo de Repuesto es Obligatorio"),
  body("costoTareasOperacionales")
    .notEmpty()
    .withMessage("El costo de Tareas Operacionales es Obligatorio"),
  body("retrasoLogistico")
    .notEmpty()
    .withMessage("El retraso logistico puede ser 0"),
  body("costoUnitarioParada")
    .notEmpty()
    .withMessage("El Costo Unitario por Parada es obligatoria"),
  handleInputErrors,
  MethodCMCController.createMethodCMC,
);

router.get(
  "/:projectId/methods/:methodId/cmc",
  param("methodId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodCMCController.getAllMethodsCMC,
);

router.get(
  "/:projectId/methods/:methodId/cmc/:cmcId",
  param("cmcId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodCMCController.getMethodCMCById,
);

router.put(
  "/:projectId/methods/:methodId/cmc/:cmcId",
  param("cmcId").isMongoId().withMessage("ID NO VÁLIDO"),
  body("horas").notEmpty().withMessage("La Horas Son Obligatorias"),
  body("MTBF").notEmpty().withMessage("El MTBF es Obligatorio"),
  body("duracionTarea")
    .notEmpty()
    .withMessage("La Duración de la Tarea es obligatoria"),
  body("costoHoraTrabajo")
    .notEmpty()
    .withMessage("El Costo de Horas de Trabajo es Obligatorio"),
  body("repuestos")
    .notEmpty()
    .withMessage("El costo de Repuesto es Obligatorio"),
  body("costoTareasOperacionales")
    .notEmpty()
    .withMessage("El costo de Tareas Operacionales es Obligatorio"),
  body("retrasoLogistico")
    .notEmpty()
    .withMessage("El retraso logistico puede ser 0"),
  body("costoUnitarioParada")
    .notEmpty()
    .withMessage("El Costo Unitario por Parada es obligatoria"),
  handleInputErrors,
  MethodCMCController.updateMethodCMC,
);

router.delete(
  "/:projectId/methods/:methodId/cmc/:cmcId",
  param("cmcId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodCMCController.deleteMethodCMCById,
);
/*
 * Terminamos con las rutas del Método CMC.
 * Ahora continuaremos con las rutas para el Método CRP.
 */

router.post(
  "/:projectId/methods/:methodId/crp",
  param("methodId").isMongoId().withMessage("ID No Valido"),
  body("tasaDemanda")
    .notEmpty()
    .withMessage("La tasa de demanda es obligatorio"),
  body("tiempoVuelta")
    .notEmpty()
    .withMessage("El tiempo de vueltas es obligatoria"),
  body("tamanoRecipiente")
    .notEmpty()
    .withMessage("El tamaño del recipiente es obligatoria"),
  handleInputErrors,
  MethodCRPController.createMethodCRP,
);

router.get(
  "/:projectId/methods/:methodId/crp",
  param("methodId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodCRPController.getAllMethodsCRP,
);

router.get(
  "/:projectId/methods/:methodId/crp/:crpId",
  param("crpId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodCRPController.getMethodCRPById,
);

/*
 * Terminamos con las rutas del MétodoCRP.
 * Ahora continuaremos con las rutas para el Método RI.
 */

router.post(
  "/:projectId/methods/:methodId/ri",
  param("methodId").isMongoId().withMessage("ID no válido"),
  body("demandaAnual").notEmpty().withMessage("Ingrese la Demanda Anual (D)"),
  body("cantidadPedido")
    .notEmpty()
    .withMessage("Ingrese la Cantidad de Pedido (Q)"),
  body("inventarioSeguridad")
    .notEmpty()
    .withMessage("Ingrese el Inventario de Seguridad (SS)"),
  body("cicloRevision")
    .notEmpty()
    .withMessage("Ingrese el Ciclo de Revisión (T)"),
  body("valorSemanas")
    .notEmpty()
    .withMessage("Ingrese la Cantidad de Semanas en el Año"),
  handleInputErrors,
  MethodRIController.createMethodRI,
);

router.get(
  "/:projectId/methods/:methodId/ri",
  param("methodId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodRIController.getAllMethodsRI,
);

router.get(
  "/:projectId/methods/:methodId/ri/:rioId",
  param("rioId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodRIController.getMethodRIOById,
);

router.put(
  "/:projectId/methods/:methodId/ri/:rioId",
  param("rioId").isMongoId().withMessage("ID no válido"),
  body("demandaAnual").notEmpty().withMessage("Ingrese la Demanda Anual (D)"),
  body("cantidadPedido")
    .notEmpty()
    .withMessage("Ingrese la Cantidad de Pedido (Q)"),
  body("inventarioSeguridad")
    .notEmpty()
    .withMessage("Ingrese el Inventario de Seguridad (SS)"),
  body("cicloRevision")
    .notEmpty()
    .withMessage("Ingrese el Ciclo de Revisión (T)"),
  body("valorSemanas")
    .notEmpty()
    .withMessage("Ingrese la Cantidad de Semanas en el Año"),
  handleInputErrors,
  MethodRIController.updateMethodRIOById,
);

router.delete(
  "/:projectId/methods/:methodId/ri/:rioId",
  param("rioId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  MethodRIController.deleteMethodRIOById,
);

/*
 * Terminamos con las rutas del Método RIO.
 * Ahora continuaremos con las rutas para el Método LUC.
 */

router.post(
  "/:projectId/methods/:methodId/luc",
  param("methodId").isMongoId().withMessage("ID No Valido"),
  body("semanas").notEmpty().withMessage("Las Semanas son obligatorias"),
  body("requerimientoBruto")
    .notEmpty()
    .withMessage("El Reuqerimiento Bruto es obligatorio"),
  body("LT").notEmpty().withMessage("El Requerimiento Bruto es obligatorio"),
  body("K").notEmpty().withMessage("El Costos de Mantenimiento es obligatorio"),
  body("S").notEmpty().withMessage("El Costo de Ordenar es obligatorio"),
  handleInputErrors,
  MethodLUCController.createMethodLUC,
);

export default router;
