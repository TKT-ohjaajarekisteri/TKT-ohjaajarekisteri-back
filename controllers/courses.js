const coursesRouter = require('express').Router()
const db = require('../models/index')
const checkAdmin = require('../utils/middleware/checkRoute').checkAdmin
const checkLogin = require('../utils/middleware/checkRoute').checkLogin
/*
const getTokenFrom = require('../utils/middleware/checkRoute').getTokenFrom
const jwt = require('jsonwebtoken')
const config = require('../config')
*/

//Get request that returns all courses on the database
coursesRouter.get('/', checkLogin, async (request, response) => {
  const courses = await db.Course.findAll({})
  response.status(200).json(courses) // todo: formatointi
})

/*
coursesRouter.post('/', checkLogin, async (request, response) => {
  const body = request.body
  try {

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, config.secret)

    // get current user from db
    const user = await db.User.findOne({
      where: {
        user_id: decodedToken.user_id
      }
    })

    const student = await db.Student.findOne({
      where: {
        student_id: user.role_id
      }
    })

    // check if course exists in db
    let course = await db.Course.findOne({
      where: {
        learningopportunity_id: body.learningopportunity_id,
        period: body.period,
        year: body.year
      }
    })

    if (!course) {
      course = await db.Course.create({
        learningopportunity_id: body.learningopportunity_id,
        course_name: body.course_name,
        period: body.period,
        year: body.year
      })
    }
    await student.addCourse(course)

    response.status(201).json(course)

  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'bad request' })
  }
})
*/

//Post request that adds a course to the database by Admin
coursesRouter.post('/', checkAdmin, async (request, response) => {
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
coursesRouter.get('/:id', checkLogin, async (request, response) => {
  const course = await db.Course
    .findByPk(request.params.id)
  response.status(200).json(course)
})

//Get request that returns all of the students on a course
coursesRouter.get('/:id/students', checkLogin, async (request, response) => {
  const course = await db.Course
    .findByPk(request.params.id)
  const students = await course.getStudents()

  // hide student numbers from JSON
  students.forEach(student => {
    student.student_number = ''
  })
  response.status(200).json(students)
})

//Delete request that deletes a course from the database based on id
coursesRouter.delete('/:id', checkAdmin, async (request, response) => {
  try {
    await db.Course.destroy({ where: { course_id: request.params.id } })
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'bad request' })
  }
})


module.exports = coursesRouter