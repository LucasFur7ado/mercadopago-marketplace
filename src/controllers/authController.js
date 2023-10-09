import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { promisePool } from '../db/index.js'
import { validationResult } from 'express-validator'

export const authController = {}

authController.login = async (req, res, next) => {

  const errors = validationResult(req).array({ onlyFirstError: true })
  if (errors.length) return next(new Error(errors[0].msg))

  try {
    const q1 = `select * from users where email = $1`
    const r = await promisePool.query(q1, [req.body.email])
    const user = r.rows[0]

    if (user == undefined || !user || user == null)
      return res.send({
        success: false,
        message: 'Invalid user'
      })

    if (!(await bcrypt.compare(req.body.password, user?.password)))
      return res.send({
        success: false,
        message: 'Invalid credentials'
      })

    const token = jwt.sign({ id: user?.id }, process.env.LOGIN_SECRET, {
      expiresIn: '6h'
    })

    res.send({
      success: true,
      token,
      user: {
        id: user.id,
        role: user.role,
      }
    })
  } catch (error) {
    console.log({ error })

    res.send({
      success: false,
      message: error
    })
  }
}