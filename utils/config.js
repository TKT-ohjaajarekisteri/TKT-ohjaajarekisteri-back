if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.DEV_PORT
let databaseUrl = process.env.DEV_DATABASE_URL
let secret = process.env.SECRET
let logging = true
let fakeLogin = false
let login = 'http://opetushallinto.cs.helsinki.fi/login'

if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT
  databaseUrl = process.env.DATABASE_URL
  logging = false
}

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  databaseUrl = process.env.TEST_DATABASE_URL
  logging = false,
  fakeLogin = true
}

if (process.env.NODE_ENV === 'development') {
  port = process.env.DEV_PORT
  databaseUrl = process.env.DEV_DATABASE_URL
  fakeLogin = true
}

module.exports = {
  databaseUrl,
  port,
  logging,
  secret,
  login,
  fakeLogin
}