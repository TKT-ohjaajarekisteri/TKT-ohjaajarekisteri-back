const coursesRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, checkLogin } = require('../utils/middleware/checkRoute')
const updateCourses = require('../utils/middleware/updateCourses').updateCourses
const getISOWeek = require('date-fns/get_iso_week')

// JS object for ending weeks of periods 1-5. week of year : period number
const periods = { 9 : 3, 18 : 4, 35 : 5, 42: 1, 50 : 2 }



//Get request that returns all courses on the database 
coursesRouter.get('/', checkLogin, async (req, res) => {
  const courses = await db.Course.findAll({})
  
  const today = new Date()
  const year = today.getFullYear()
  const week = getISOWeek(today)
  var period = 0

  Object.keys(periods).forEach(function(key) {
    if (key <= week){
      period = periods[key]
    }
  });

  const periodNow = (parseInt(period) + 1) % 5
 
  var filteredCourses = courses.filter(c=> {
    return c.year >= year || (c.period >= periodNow && c.year > year)
  });

  res.status(200).json(filteredCourses)
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
