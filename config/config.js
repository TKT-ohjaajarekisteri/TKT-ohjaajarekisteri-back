const { production, development, test } = require('./sequelize')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let sequelizeConfig = null
let port = null
let secret = process.env.SECRET
let logging = true
let fakeLogin = false
let login = 'http://opetushallinto.cs.helsinki.fi/login'

if (process.env.NODE_ENV === 'production') {
  sequelizeConfig = production
  port = process.env.PORT
}

if (process.env.NODE_ENV === 'test') {
  sequelizeConfig = test
  fakeLogin = true
  port = process.env.TEST_PORT
}

if (process.env.NODE_ENV === 'development') {
  sequelizeConfig = development
  fakeLogin = true
  port = process.env.DEV_PORT
}

module.exports = {
  sequelizeConfig,
  port,
  logging,
  secret,
  login,
  fakeLogin
}