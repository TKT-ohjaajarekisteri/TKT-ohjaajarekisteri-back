if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
let port = null
let databaseUrl = null
let logging = true
let secret = null

if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT
  databaseUrl = process.env.DATABASE_URL
  logging = false
}

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  databaseUrl = process.env.TEST_DATABASE_URL
  logging = false,
  secret = process.env.SECRET
}

if (process.env.NODE_ENV === 'development') {
  port = process.env.DEV_PORT
  databaseUrl = process.env.DEV_DATABASE_URL
  secret = process.env.SECRET
}

module.exports = {
  databaseUrl,
  port,
  logging,
  secret
}