const studentsRouter = require('express').Router()
const db = require('../models/index')
const { checkUser, checkAdmin, getTokenFrom } = require('../utils/middleware/checkRoute')
const jwt = require('jsonwebtoken')
const config = require('../config/config')


//Get req that returns all students as JSON
studentsRouter.get('/', checkAdmin, async (req, res) => {
  let students = await db.Student.findAll({})
  res.status(200).json(students) // todo: formatointi
})

//Get req that returns a student based on id
studentsRouter.get('/:id', checkUser, async (req, res) => {
  const user = await db.User
    .findByPk(req.params.id)
  const student = await db.Student
    .findByPk(user.role_id)
  res.status(200).json(student)
})

//Get req that returns all of the courses a student is on
studentsRouter.get('/:id/courses', checkUser, async (req, res) => {
  const user = await db.User
    .findByPk(req.params.id)
  const student = await db.Student
    .findByPk(user.role_id)
  const courses = await student.getCourses()

  res.status(200).json(courses)
})

studentsRouter.post('/', checkUser, async (req, res) => {
  const body = req.body
  try {

    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, config.secret)

    // get current user from db
    const user = await db.User.findOne({
      where: {
        user_id: decodedToken.id
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

    res.status(201).json(course)

  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'bad req' })
  }
})

//Delete req that deletes a student from the database based on id
studentsRouter.delete('/:id', checkUser, async (req, res) => {
  try {
    await db.Student.destroy({ where: { student_id: req.params.id } })
    res.status(204).end()

  } catch (exception) {
    console.log(exception)
    res.status(400).json({ error: 'bad req' })
  }
})

studentsRouter.put('/:id', checkUser, async (req, res) => {
  try {
    let user = await db.User.findOne({ where: { user_id: req.params.id } })
    let student = await db.Student.findOne({ where: { student_id: user.role_id } })
    const body = req.body

    await student.update({ nickname: body.nickname, email: body.email, phone: body.phone })
    res.status(201).end()
    
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

// UNSAFE!!! Only for development
// studentsRouter.delete('/dev/:student_number', async (req, res) => {
//   try {
//     const student = await db.Student.findOne({ where: { student_number: req.params.student_number } })
//     await db.User.destroy({ where: { role_id: student.student_id } })
//     await db.Student.destroy({ where: { student_id: student.student_id } })
//     res.status(204).end()

//   } catch (exception) {
//     console.log(exception)
//     res.status(400).json({ error: 'bad req' })
//   }
// })

module.exports = studentsRouter