const coursesRouter = require('express').Router()
//const Course = require('../models/course')   // tuleeko nämä db:n kautta?
//const Student = require('../models/student') // tuleeko nämä db:n kautta?
const db = require('../models/index')

coursesRouter.get('/', async (request, response) => {
  const courses = await db.Course
    .findAll({})
  response.status(200).json(courses) // todo: formatointi
  //response.status(200)
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
  const course = await db.Course
  .findByPk(request.params.id)
  response.status(200).json({ course })
})


module.exports = coursesRouter