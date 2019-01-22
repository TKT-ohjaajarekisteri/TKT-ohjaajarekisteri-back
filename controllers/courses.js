const coursesRouter = require('express').Router()
const Course = require('../models/course')
const Student = require('../models/student')


coursesRouter.get('/', async (request, response) => {
  response.status(200)
})

coursesRouter.post('/', async (request, response) => {


})

coursesRouter.get('/:id', async (request, response) => {


})


module.exports = coursesRouter