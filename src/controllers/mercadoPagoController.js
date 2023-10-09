import axios from 'axios'
import { nanoid } from 'nanoid'
import { config } from '../config.js'
import { promisePool } from '../db/index.js'
import { validationResult } from 'express-validator'

export const mercadoPagoController = {}

mercadoPagoController.getOAuthLink = async (req, res) => {

  const randomId = nanoid()
  const redirectUrl = config.thisApplicationURL + '/OAuthResult'
  const updateAuthorizationsQuery = `insert into authorizations (user_id, state) values ($1, $2) on conflict (user_id) do update set state = $2`

  await promisePool.query(updateAuthorizationsQuery, [req.userBody.user.id, randomId])
    .then(async result => {
      res.send({
        success: true,
        link: `https://auth.mercadopago.com/authorization?client_id=${process.env.MP_APP_ID}&response_type=code&platform_id=mp&state=${randomId}&redirect_uri=${redirectUrl}`
      })
    })
    .catch(error => {
      console.log({ error })

      res.send({
        success: false,
        message: error
      })
    })
}

mercadoPagoController.OAuthResult = async (req, res, next) => {

  const errors = validationResult(req).array({ onlyFirstError: true })

  if (errors.length)
    return res.render(`mpOAuthResult`, {
      success: false,
      message: 'Algo salió mal',
      emptyData: true
    })

  const data = {
    'client_id': process.env.MP_APP_ID,
    'client_secret': process.env.MP_CLIENT_SECRET,
    'redirect_uri': config.thisApplicationURL + '/OAuthResult',
    'grant_type': 'authorization_code',
    'code': req.query.code,
    // 'test_token': true
  }

  // Get seller credentials

  await axios.post('https://api.mercadopago.com/oauth/token', data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
    }
  })
    .then(async r => {
      const saveTokensQuery = `update authorizations set state = null, refresh_token = $1, access_token = $2 where state = $3`

      await promisePool.query(saveTokensQuery, [r.data.refresh_token, r.data.access_token, req.query.state])
        .then(async r => {
          if (r.rowCount) {
            return res.render(`mpOAuthResult`, {
              success: true
            })
          }

          throw new Error('Something went wrong')
        })
    })
    .catch(error => {
      console.log({ error })

      res.render(`mpOAuthResult`, {
        success: false,
        message: 'Algo salió mal, intenta de nuevo más tarde'
      })
    })
}

mercadoPagoController.getPreferenceLink = async (req, res, next) => {

  const errors = validationResult(req).array({ onlyFirstError: true })
  if (errors.length) return next(new Error(errors[0].msg))

  const { productId, quantity } = req.body
  const { user: { email } } = req.userBody

  try {
    const authorizationDataQuery = 'select * from authorizations where user_id = (select id seller_id from products where id = $1)'
    const authorizationDataResult = await promisePool.query(authorizationDataQuery, [productId])

    if (!authorizationDataResult.rows.length)
      throw new Error('Product does not exists or is not avaliable')

    const productDataQuery = 'select * from products where id = $1'
    const productDataResult = await promisePool.query(productDataQuery, [productId])
    const { name, description, price } = productDataResult.rows[0]

    const data = {
      'items': [
        {
          'title': name,
          'unit_price': price,
          'quantity': +quantity ?? 1,
          'currency_id': config.currencyId,
          'description': description ?? 'No description',
        }
      ],
      'payer': {
        'email': email
      },
      'back_urls': {
        'success': config.frontendApplicationURL + '/success',
        'pending': config.frontendApplicationURL + '/pending',
        'failure': config.frontendApplicationURL + '/failure',
      },
      'marketplace_fee': Number((config.marketplaceFee * (price * (+quantity ?? 1)) / 100)),
      'notification_url': config.thisApplicationURL + '/notifications'

      // Take a look at all the available fields:
      // https://www.mercadopago.com/developers/es/reference/preferences/_checkout_preferences/post
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authorizationDataResult.rows[0].access_token}`
    }

    const mpApiEndpoint = 'https://api.mercadopago.com/checkout/preferences'
    const preferenceDataResult = await axios.post(mpApiEndpoint, data, { headers })

    res.send({
      success: true,
      link: preferenceDataResult.data.init_point
    })
  } catch (error) {
    console.log({ error })

    res.send({
      success: false,
      message: error.message
    })
  }
}

mercadoPagoController.notifications = (req, res) => {
  
  // Implement notifications function (i.e Telegram messages)
  // Always return status 200 so Mercado Pago understands the data reached the server
  res.send('ok')
}