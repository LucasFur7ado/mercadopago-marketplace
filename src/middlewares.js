import sanitizeHtml from 'sanitize-html'
import expressRateLimit from 'express-rate-limit'
import { userVerification } from './services/userVerification.js'

export const rateLimit = expressRateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: 'Has excedido el límite de solicitudes. Intenta de nuevo más tarde'
})

export const globalErrors = (error, req, res, next) => {
  console.log({ error })

  res.send({
    success: false,
    message: error.message
  })
}

export const isLogged = async (req, res, next) => {
  const token = req.headers.authorization ?? false
  const result = await userVerification(token)

  if (!result.isLogged || !result.success)
    return res.status(result.status ?? 401).send({
      success: false,
      message: result.message ?? 'Invalid credentials'
    })

  req.userBody = {
    user: result.user,
    isLogged: true
  }

  next()
}

export const isDev = async (req, res, next) => {
  if (process.env.N_ENV !== 'development')
    return res.status(503).send({
      success: false,
      message: 'Closed route'
    })

  next()
}

export const sanitize = (req, res, next) => {
  Object.keys(req.body).map(k => {
    if (!(typeof req.body[k] == 'boolean')) {
      req.body[k] = sanitizeHtml(req.body[k])
    }
  })

  next()
}