const { Client } = require('pg')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const coursesRouter = require('./controllers/courses')
const studentsRouter = require('./controllers/students')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :json :status :response-time ms'))

const apiUrl = '/api'
app.use('/api/courses', coursesRouter)
app.use('/api/students', studentsRouter)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})