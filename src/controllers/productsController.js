import { promisePool } from '../db/index.js'

export const productsController = {}

productsController.getProducts = async (req, res) => {

  await promisePool.query(`select * from products`)
    .then(result => {
      res.send({
        success: true,
        products: result.rows
      })
    })
    .catch(error => {
      console.log({ error })

      res.send({
        success: false,
        message: 'Something went wrong'
      })
    })
}