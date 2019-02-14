const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/middleware/logger')

// Run middleware given except for a specific path
const unless = (path, middleware) => {
  return (req, res, next) => {
    if (path === req.path) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(unless('/api/login', logger))
app.use(express.static('build'))

// Routers
const coursesRouter = require('./controllers/courses')
const studentsRouter = require('./controllers/students')
const loginRouter = require('./controllers/login')
const tokenCheckRouter = require('./controllers/tokenCheck')


const apiUrl = '/api'
app.use(`${apiUrl}/courses`, coursesRouter)
app.use(`${apiUrl}/students`, studentsRouter)
app.use(`${apiUrl}/login`, loginRouter)
app.use(`${apiUrl}/tokenCheck`, tokenCheckRouter)

// Initialize server
const PORT = config.port
const server = http.createServer(app)

if (process.env.NODE_ENV !== 'test') {
  // Database connection
  const db = require('./models')
  db.connect()

  {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
}

module.exports = {
  app, server
}
