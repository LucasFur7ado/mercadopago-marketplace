import { body, query } from 'express-validator'

export const validations = {}

validations.loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email requerido')
    .isEmail()
    .withMessage('Email inválido')
    .isEmail()
    .withMessage('El email no es valido'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida')
    .isLength({ min: 3, max: 100 })
    .withMessage('Contraseña inválida')
]

validations.mpOAuthValidation = [
  query('code')
    .notEmpty()
    .withMessage('Code requerido'),
  query('state')
    .notEmpty()
    .withMessage('State requerido')
]

validations.paymentValidation = [
  body('productId')
    .notEmpty()
    .withMessage('productId requerido')
]