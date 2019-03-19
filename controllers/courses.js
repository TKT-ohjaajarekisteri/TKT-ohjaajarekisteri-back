const coursesRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, checkLogin } = require('../utils/middleware/checkRoute')
const updateCourses = require('../utils/middleware/updateCourses').updateCourses
const getISOWeek = require('date-fns/get_iso_week')

// JS object for ending weeks of periods 1-5. Marks the week when course is no longer listed
// format:  period number : week of the year.
const periods = { 1:42, 2:50, 3:9, 4:18, 5:35 }


//Get request that returns all courses on the database 
coursesRouter.get('/', checkLogin, async (req, res) => {
  try {
    const courses = await db.Course.findAll({})

    const today = new Date()
    const year = today.getFullYear()
    const week = getISOWeek(today)

    var filteredCourses = courses.filter(c => {
      return (periods[c.period] > week && c.year == year) || c.year > year
    })

    res.status(200).json(filteredCourses)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'malformatted json' })
  }

})


//Get request that returns all courses on the database 
/* coursesRouter.get('/', checkLogin, async (req, res) => {
  const courses = await db.Course.findAll({})
  res.status(200).json(courses)
})
 */



//Get request that returns a course based on id
coursesRouter.get('/:id', checkLogin, async (req, res) => {
  const course = await db.Course
    .findByPk(req.params.id)
  res.status(200).json(course)
})

//Get request that returns all of the students on a course
coursesRouter.get('/:id/students', checkAdmin, async (req, res) => {
  const course = await db.Course
    .findByPk(req.params.id)
  const students = await course.getStudents()
  res.status(200).json(students)
})

/* Only for development
//Delete request that deletes a course from the database based on id
coursesRouter.delete('/:id', checkAdmin, async (req, res) => {
  try {
    await db.Course.destroy({ where: { course_id: req.params.id } })
    res.status(204).end()

  } catch (exception) {
    console.log(exception)
    res.status(400).json({ error: 'bad req' })
  }
})
*/

/* Only for development, manual posting is not necessary
//Post request that adds a course to the database by Admin
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
*/

/*
//Maybe unnecessary?
//Updates all course data from studies.helsinki.fi course list
//Returns the added courses as json
coursesRouter.get('/update', checkAdmin, async (req, res) => {
  try {
    const updatedCourses = await updateCourses()
    res.status(200).json(updatedCourses)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'malformatted json' })
  }
})
*/

module.exports = coursesRouter
