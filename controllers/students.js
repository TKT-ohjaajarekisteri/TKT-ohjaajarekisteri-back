const studentsRouter = require('express').Router()
//const Course = require('../models/course')
//const Student = require('../models/student')

studentsRouter.get('/', async (request, response) => {
  response.status(200)
})

studentsRouter.post('/', async (request, response) => {
  try {
    response.status(201)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

studentsRouter.get('/:id', async (request, response) => {
  response.status(200)
})

module.exports = studentsRouter