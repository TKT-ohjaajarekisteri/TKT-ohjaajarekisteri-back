const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./utils/config')

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

// Routers
const coursesRouter = require('./controllers/courses')
const studentsRouter = require('./controllers/students')


const apiUrl = '/api'
app.use(`${apiUrl}/courses`, coursesRouter)
app.use(`${apiUrl}/students`, studentsRouter)

// Database connection
const db = require('./models')
db.connect()

// Initialize server
const PORT = config.port
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server running on port ${config.port}`)
})

// Close database connection
server.on('close', () => {
  db.sequelize.close()
    .then(() => console.log('client has disconnected'))
    .catch(err => console.log('error during disconnection', err.stack))
})

module.exports = {
  app, server
}
