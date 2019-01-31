const coursesRouter = require('express').Router()
const db = require('../models/index')

//Get request that returns all courses on the database
coursesRouter.get('/', async (request, response) => {
  const courses = await db.Course.findAll({})
  response.status(200).json(courses) // todo: formatointi
})

//Post request that adds a course to the database
coursesRouter.post('/', async (request, response) => {
  try {

    const course = await db.Course.create({
      learningopportunity_id: request.body.learningopportunity_id,
      course_name: request.body.course_name,
      period: request.body.period,
      year: request.body.year
    })
    response.status(201).json(course)

  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'bad request' })
  }
})

//Get request that returns a course based on id
coursesRouter.get('/:id', async (request, response) => {
  const course = await db.Course
    .findByPk(request.params.id)
  response.status(200).json(course)
})

//Get request that returns all of the students on a course
coursesRouter.get('/:id/students', async (request, response) => {
  const course = await db.Course
    .findByPk(request.params.id)
  const students = await course.getStudents()

  response.status(200).json(students)
})

//Delete request that deletes a course from the database based on id
coursesRouter.delete('/:id', async (request, response) => {
  try {
    await db.Course.destroy({ where: { course_id: request.params.id } })
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'bad request' })
  }
})


module.exports = coursesRouter