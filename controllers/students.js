const studentsRouter = require('express').Router()
const Course = require('../models/course')
const Student = require('../models/student')

studentsRouter.get('/', async (request, response) => {
  response.status(200)
})

studentsRouter.post('/', async (request, response) => {

})

studentsRouter.get('/:id', async (request, response) => {

})

module.exports = studentsRouter