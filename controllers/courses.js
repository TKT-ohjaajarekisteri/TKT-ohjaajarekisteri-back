const coursesRouter = require('express').Router()
const db = require('../models/index')

coursesRouter.get('/', async (request, response) => {
  const courses = await db.Course.findAll({})
  response.status(200).json(courses) // todo: formatointi
})

coursesRouter.post('/', async (request, response) => {
  try {

    const course = await db.Course.create({
      learningopportunity_id: request.body.learningopportunity_id,
      course_name: request.body.course_name,
      period: request.body.period,
      year: request.body.year
    })
    response.status(201).json({ course })

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