const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
//const studentRouter = require('./controllers/students')
//const courseRouter = require('./controllers/courses')

const config = require('./utils/config')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

const client = new Client({
  connectionString: config.databaseUrl,
  ssl: true,
})

const server = http.createServer(app)

client.connect()

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  client.end()
})

module.exports = {
  app, server
}
