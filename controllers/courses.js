const coursesRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, checkLogin } = require('../utils/middleware/checkRoute')
const updateCourses = require('../utils/middleware/updateCourses').updateCourses


//Get request that returns all courses on the database
coursesRouter.get('/', async (request, response) => {
  const courses = await db.Course.findAll({})
  response.status(200).json(courses)
})

//Updates all course data from studies.helsinki.fi course list
//Returns the added courses as json
coursesRouter.get('/update', async (request, response) => {
  try {
    const updatedCourses = updateCourses()
    response.status(200).json(updatedCourses)
  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'malformatted json' })
  }
})

//Post req that adds a course to the database by Admin
coursesRouter.post('/admin', checkAdmin, async (req, res) => {
  try {

    const course = await db.Course.create({
      learningopportunity_id: req.body.learningopportunity_id,
      course_name: req.body.course_name,
      period: req.body.period,
      year: req.body.year
    })
    res.status(201).json(course)

  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'bad req' })
  }
})


//Get req that returns a course based on id
coursesRouter.get('/:id', checkLogin, async (req, res) => {
  const course = await db.Course
    .findByPk(req.params.id)
  res.status(200).json(course)
})

//Get req that returns all of the students on a course
coursesRouter.get('/:id/students', checkLogin, async (req, res) => {
  const course = await db.Course
    .findByPk(req.params.id)
  const students = await course.getStudents()

  // hide student numbers from JSON
  students.forEach(student => {
    student.student_number = ''
  })
  res.status(200).json(students)
})

//Delete req that deletes a course from the database based on id
coursesRouter.delete('/:id', checkAdmin, async (req, res) => {
  try {
    await db.Course.destroy({ where: { course_id: req.params.id } })
    res.status(204).end()

  } catch (exception) {
    console.log(exception)
    res.status(400).json({ error: 'bad req' })
  }
})


module.exports = coursesRouter