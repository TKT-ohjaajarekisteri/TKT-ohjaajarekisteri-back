if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.TEST_PORT
let databaseUrl = process.env.TEST_DATABASE_URL

module.exports = {
  databaseUrl,
  port
}