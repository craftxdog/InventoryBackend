import { Router } from "express";
import { AuthController } from "../Controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../Middleware/Validations";


const router = Router()

router.post('/create-account',
  body('userName').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('password').isLength({min: 8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password){
      throw new Error ('Verifique las contraseñas')
    }
    return true
  }),
  body('email').isEmail().withMessage('E-mail no válido'),
  handleInputErrors,
  AuthController.createAccount
)

router.post('/confirm-account',
  body('token').notEmpty().withMessage('El Token no puede estar vacio'),
  handleInputErrors,
  AuthController.confirmAccount
)

router.post('/login',
  body('email').isEmail().withMessage('E-mail no válido'),
  body('password').notEmpty().withMessage('El password no puede estar vacio'),
  handleInputErrors,
  AuthController.login
)

router.post('/request-code',
  body('email').isEmail().withMessage('E-mail no válido'),
  handleInputErrors,
  AuthController.requestConfirmationCode
)

export default router
