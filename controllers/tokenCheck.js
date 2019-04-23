const tokenCheckRouter = require('express').Router()
const checkLogin = require('../utils/middleware/checkRoute').checkLogin

//Returns status ok if user is logged in
tokenCheckRouter.get('/login', checkLogin, (req, res) => {
  res.status(200).json({ message: 'success' })
})

module.exports = tokenCheckRouter