import jwt from 'jsonwebtoken'
import { promisePool } from '../db/index.js'

export const userVerification = async (token) => {

  if (token == undefined || !token || token == null)
    return {
      success: false,
      message: 'No token provided'
    }

  let verified, tk = token.split(' ')[1]

  try {
    verified = jwt.verify(tk, process.env.LOGIN_SECRET)
  } catch (error) {
    console.log({ error })

    return {
      success: false,
      status: error.message == 'jwt expired' ? 440 : 401,
      message: error.message == 'jwt expired' ? 'Sesión expirada' : 'Algo salió mal'
    }
  }

  if (!verified?.id)
    return { success: false }

  const query = `select id, email, is_verified from users where id = $1`

  const queryResult = await promisePool.query(query, [verified?.id])
  const user = queryResult.rows[0]

  return {
    user,
    success: !user ? false : true,
    isLogged: (user && user.is_verified) ? true : false,
  }
}