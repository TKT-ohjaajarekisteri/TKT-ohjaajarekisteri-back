const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const coursesRouter = require('./controllers/courses')
const studentsRouter = require('./controllers/students')
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

const apiUrl = '/api'
app.use(`${apiUrl}/courses`, coursesRouter)
app.use(`${apiUrl}/students`, studentsRouter)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  client.end()
})

module.exports = {
  app, server
}
