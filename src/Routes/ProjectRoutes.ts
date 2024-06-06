import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../Middleware/Validations";
import { ProjectController } from "../Controllers/ProjectController";
import { authenticate } from "../Middleware/auth";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción del método es obligatorio"),
  handleInputErrors,
  ProjectController.createProject,
);

router.get("/", ProjectController.findAllProjects);

router.get(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.findProjectById,
);

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción del método es obligatorio"),
  handleInputErrors,
  ProjectController.updateProject,
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.deleteProject,
);

export default router;
