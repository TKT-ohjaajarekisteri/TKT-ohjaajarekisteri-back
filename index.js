const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./utils/config')
const db = require('./models')

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

// Routers
const coursesRouter = require('./controllers/courses')
const studentsRouter = require('./controllers/students')
const loginRouter = require('./controllers/login')


const apiUrl = '/api'
app.use(`${apiUrl}/courses`, coursesRouter)
app.use(`${apiUrl}/students`, studentsRouter)
app.use(`${apiUrl}/login`, loginRouter)

// Initialize server
const PORT = config.port
const server = http.createServer(app)

if (process.env.NODE_ENV !== 'test') {
// Database connection
  db.connect()

  {server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })}
}

module.exports = {
  app, server
}
