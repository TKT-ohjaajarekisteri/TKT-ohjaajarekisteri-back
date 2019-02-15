const tokenCheckRouter = require('express').Router()
const checkLogin = require('../utils/middleware/checkRoute').checkLogin

tokenCheckRouter.get('/login', checkLogin, (req, res) => {
  res.status(200).json({ message: 'success' })
})

module.exports = tokenCheckRouter