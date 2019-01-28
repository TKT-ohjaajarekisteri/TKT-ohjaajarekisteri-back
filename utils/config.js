if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = null
let databaseUrl = null

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  databaseUrl = process.env.TEST_DATABASE_URL
}

if (process.env.NODE_ENV === 'development') {
  port = process.env.DEV_PORT
  databaseUrl = process.env.DEV_DATABASE_URL
}

module.exports = {
  databaseUrl,
  port
}