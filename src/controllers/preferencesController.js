import axios from 'axios'
import { promisePool } from '../db/index.js'

export const preferencesController = {}

preferencesController.getPreferences = async (req, res) => {
  const { user: { id } } = req.userBody

  try {
    const authorizationDataQuery = 'select * from authorizations where user_id = $1'
    const authorizationDataResult = await promisePool.query(authorizationDataQuery, [id])

    if (!authorizationDataResult.rows.length)
      throw new Error('Product does not exists or is not avaliable')

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authorizationDataResult.rows[0].access_token}`
    }

    const mpApiEndpoint = 'https://api.mercadopago.com/checkout/preferences'
    const preferenceDataResult = await axios(mpApiEndpoint, { headers })

    res.send({
      success: true,
      preferences: preferenceDataResult?.data?.elements
    })
  } catch (error) {
    console.log({ error })

    res.send({
      success: false,
      message: error.message
    })
  }
}