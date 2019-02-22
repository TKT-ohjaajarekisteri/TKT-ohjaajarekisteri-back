const studentsRouter = require('express').Router()
const db = require('../models/index')
const { checkUser, checkAdmin, getTokenFrom } = require('../utils/middleware/checkRoute')
const jwt = require('jsonwebtoken')
const config = require('../config/config')


//Get request that returns all students as JSON
studentsRouter.get('/', /* checkAdmin, */ async (request, response) => {
  let students = await db.Student.findAll({})
  response.status(200).json(students) // todo: formatointi
})

//Get request that returns a student based on id
studentsRouter.get('/:id', /* checkUser, */ async (request, response) => {
  const user = await db.User
    .findByPk(request.params.id)
  const student = await db.Student
    .findByPk(user.role_id)
  response.status(200).json(student)
})

//Get request that returns all of the courses a student is on
studentsRouter.get('/:id/courses', /* checkUser, */ async (request, response) => {
  const user = await db.User
    .findByPk(request.params.id)
  const student = await db.Student
    .findByPk(user.role_id)
  const courses = await student.getCourses()

  response.status(200).json(courses)
})

// Adds student to a course

studentsRouter.post('/:id/apply', /* checkUser, */ async (request, response) => {
  const body = request.body
  try {

    //const token = getTokenFrom(request)
    //const decodedToken = jwt.verify(token, config.secret)

    // get current user from db
    const user = await db.User.findOne({
      where: {
        user_id: /* decodedToken.id */ 1 // works only with hard coded student number! *WHY?*
      }
    })
    const student = await db.Student.findOne({
      where: {
        student_id: user.role_id
      }
    })
    await Promise.all(body.course_ids.map(async course_id => {
      const course = await db.Course.findOne({
        where: {
          course_id: course_id
        }
      })
      await student.addCourse(course)
      response.status(201).json(course)
    }))

  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'bad request' })
  }

})

// Deletes a course a student is on
studentsRouter.delete('/:student_id/courses/:course_id', /* checkUser, */ async (request, response) => {
  
  try {

    //const token = getTokenFrom(request)
    //const decodedToken = jwt.verify(token, config.secret)

    // get current user from db
    const user = await db.User.findOne({
      where: {
        user_id: /* decodedToken.id */ 2
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
        course_id: request.params.course_id
      }
    })
    console.log('poistettava: ', course)
    // await student.destroy(course)
    await course.destroy(student)

    response.status(201).json(course)

  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'bad request' })
  }
})


studentsRouter.post('/', checkUser, async (request, response) => {
  const body = request.body
  try {

    const token = getTokenFrom(request)
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

    response.status(201).json(course)

  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'bad request' })
  }
})

//Delete request that deletes a student from the database based on id
studentsRouter.delete('/:id', checkUser, async (request, response) => {
  try {
    await db.Student.destroy({ where: { student_id: request.params.id } })
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'bad request' })
  }
})

studentsRouter.put('/:id', checkUser, async (request, response) => {
  try {
    let user = await db.User.findOne({ where: { user_id: request.params.id } })
    let student = await db.Student.findOne({ where: { student_id: user.role_id } })
    const body = request.body

    await student.update({ nickname: body.nickname, email: body.email, phone: body.phone })
    response.status(201).end()

  } catch (error) {
    console.log(error.message)
    response.status(400).json({ error: 'bad request' })
  }
})

// UNSAFE!!! Only for development
// studentsRouter.delete('/dev/:student_number', async (request, response) => {
//   try {
//     const student = await db.Student.findOne({ where: { student_number: request.params.student_number } })
//     await db.User.destroy({ where: { role_id: student.student_id } })
//     await db.Student.destroy({ where: { student_id: student.student_id } })
//     response.status(204).end()

//   } catch (exception) {
//     console.log(exception)
//     response.status(400).json({ error: 'bad request' })
//   }
// })

module.exports = studentsRouter