const adminsRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, authenticateToken } = require('../utils/middleware/checkRoute')
const bcrypt = require('bcrypt')


//Only for testing
/*adminsRouter.get('/', async (request, response) => {
  const admins = await db.Admin.findAll({})
  response.status(200).json(admins)
})*/

//Update admin password
adminsRouter.put('/', checkAdmin, async (req, res) => {
  try {
    const body = req.body
    const token = authenticateToken(req)

    const adminUser = await db.User.findByPk(token.id)
    const admin = await db.Admin.findByPk(adminUser.role_id)

    if( await bcrypt.compare(body.oldPassword, admin.passwordHash)) {

      const saltRounds = 10
      const newPasswordHash = await bcrypt.hash(body.newPassword, saltRounds)
      await admin.update({ passwordHash: newPasswordHash })
      res.status(200).end()

    } else {
      console.log('old password does not match')
      res.status(400).json({ error: 'old password does not match' })
    }

  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

module.exports = adminsRouter