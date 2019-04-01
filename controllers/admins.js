const adminsRouter = require('express').Router()
//const db = require('../models/index')
//const { checkAdmin, checkLogin } = require('../utils/middleware/checkRoute')


//Only for testing
/*adminsRouter.get('/', async (request, response) => {
  const admins = await db.Admin.findAll({})
  response.status(200).json(admins)
})*/


module.exports = adminsRouter