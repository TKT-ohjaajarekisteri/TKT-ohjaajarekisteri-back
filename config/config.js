const { production, development, test, travis } = require('../config/sequelize')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let sequelizeConfig = null
let port = null
let secret = process.env.SECRET
let logging = true
let fakeLogin = false
let login = 'http://opetushallinto.cs.helsinki.fi/login'
const candidateCoursesUrl = 'https://studies.helsinki.fi/organizations/500-K005/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching&types=exam'
const masterCoursesUrl = 'https://studies.helsinki.fi/organizations/500-M009/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching&types=exam'

if (process.env.NODE_ENV === 'production') {
  sequelizeConfig = production
  port = process.env.PORT
}

if (process.env.NODE_ENV === 'test') {
  sequelizeConfig = test
  logging = false
  fakeLogin = true
  port = process.env.TEST_PORT
}

if (process.env.NODE_ENV === 'travis') {
  sequelizeConfig = travis
  logging = false
  fakeLogin = true
  port = process.env.TEST_PORT
}

if (process.env.NODE_ENV === 'development') {
  sequelizeConfig = development
  port = process.env.DEV_PORT
}

module.exports = {
  sequelizeConfig,
  port,
  logging,
  secret,
  login,
  fakeLogin,
  candidateCoursesUrl,
  masterCoursesUrl
}