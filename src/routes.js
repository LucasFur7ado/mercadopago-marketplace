import { Router } from 'express'
import { isLogged, isDev } from './middlewares.js'
import { validations } from './services/validations.js'
import { dbController } from './controllers/dbController.js'
import { authController } from './controllers/authController.js'
import { productsController } from './controllers/productsController.js'
import { preferencesController } from './controllers/preferencesController.js'
import { mercadoPagoController } from './controllers/mercadoPagoController.js'

const router = Router()
const {
  loginValidation,
  mpOAuthValidation,
  paymentValidation,
} = validations

// Home
router.get('/', (req, res) => {
  res.render('index')
})

// Authentication
router.post('/login', loginValidation, authController.login)

// General purpose
router.get('/dbDataSeed', isDev, dbController.dbDataSeed)
router.get('/dbSchemeSeed', isDev, dbController.dbSchemeSeed)

// Getters
router.get('/getProducts', productsController.getProducts)
router.get('/getPreferences', isLogged, preferencesController.getPreferences)

// Mercado pago
router.post('/notifications', mercadoPagoController.notifications)
router.get('/OAuthResult', mpOAuthValidation, mercadoPagoController.OAuthResult)
router.get('/getOAuthLink', isLogged, mercadoPagoController.getOAuthLink)
router.post('/getPreferenceLink', isLogged, paymentValidation, mercadoPagoController.getPreferenceLink)

export default router