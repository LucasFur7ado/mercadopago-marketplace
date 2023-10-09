import fs from 'fs'
import { promisePool } from '../db/index.js'

export const dbController = {}

dbController.dbSchemeSeed = async (req, res) => {
  return await queriesExecuter(res, promisePool, 'scheme')
}

dbController.dbDataSeed = async (req, res) => {
  return await queriesExecuter(res, promisePool, 'data')
}

const queriesExecuter = async (res, promisePool, type) => {
  let result = true

  const sqlQueries = fs.readFileSync(`src/db/sql/${type}.sql`, 'utf-8')
  const qs = sqlQueries.split(';')

  for (let k = 0; k < qs.length; k++) {
    await promisePool.query(qs[k])
      .then(r => {
        console.log('Done', qs[k])
      })
      .catch(error => {
        console.log({ error })

        result = false
        k = qs.length
      })
  }

  if (!result)
    return res.send({
      success: false,
      message: 'Something went wrong'
    })

  res.send({ success: true })
}