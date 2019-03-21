const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config/config')
const logger = require('./utils/middleware/logger')
const cron = require('node-cron')
const logging = require('./config/config').logging
const updateCourses = require('./utils/middleware/updateCourses').updateCourses

// Run middleware given except for a specific path
const unless = (path, middleware) => {
  return (req, res, next) => {
    if (path === req.path) {
      return next()
    } else if (logging) {
      return middleware(req, res, next)
    } else {
      return next()
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
const adminsRouter = require('./controllers/admins')
const loginRouter = require('./controllers/login')
const tokenCheckRouter = require('./controllers/tokenCheck')


const apiUrl = '/api'
app.use(`${apiUrl}/courses`, coursesRouter)
app.use(`${apiUrl}/students`, studentsRouter)
app.use(`${apiUrl}/admins`, adminsRouter)
app.use(`${apiUrl}/login`, loginRouter)
app.use(`${apiUrl}/tokenCheck`, tokenCheckRouter)

//Updates courses on database every day at one second before midnight
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('59 23 * * *', async function() {
    try {
      await updateCourses()
    } catch(exception) {
      console.log(exception.message)
    }
  })
}

// Initialize server
const PORT = config.port
const server = http.createServer(app)

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  // Database connection
  const db = require('./models')
  connect(db)
  {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
}

async function connect(db) {
  await db.connect()
  await updateCourses()
}

app.on('close', () => db.sequelize.close())

module.exports = {
  app, server
}
