const coursesRouter = require('express').Router()
//const Course = require('../models/course')
//const Student = require('../models/student')


coursesRouter.get('/', async (request, response) => {
  response.status(200)
})

coursesRouter.post('/', async (request, response) => {
  try {
    response.status(201)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

coursesRouter.get('/:id', async (request, response) => {
  response.status(200)
})


module.exports = coursesRouter