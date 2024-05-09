import { Router } from 'express'
import { body, param } from 'express-validator';
import { handleInputErrors } from '../Middleware/Validations';
import {  ProjectController } from '../Controllers/ProjectController';


const router = Router();

router.post('/', 
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description').notEmpty().withMessage('La descripción del método es obligatorio'),
  handleInputErrors,
  ProjectController.createProject
)

router.get('/', ProjectController.findAllProjects
)

router.get('/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  ProjectController.findProjectById
)


router.put('/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description').notEmpty().withMessage('La descripción del método es obligatorio'),
  handleInputErrors,
  ProjectController.updateProject
)


export default router
