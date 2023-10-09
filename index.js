import 'dotenv/config'
import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import router from './src/routes.js'
import {
  sanitize,
  rateLimit,
  globalErrors,
} from './src/middlewares.js'

const app = express()
const port = process.env.PORT ?? 7000

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(cors({
  origin: [
    'http://localhost:5173'
  ]
}))
app.use(rateLimit)
app.use(helmet())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(sanitize)
app.use(router)
app.use(globalErrors)
app.use((req, res) => {
  res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`Server on port: ${port}`)
})