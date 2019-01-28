const studentsRouter = require('express').Router()
const Sequelize = require('sequelize')
const db = require('../models/index')
// const Student = db.Student
// const Course = db.Course

studentsRouter.get('/', async (request, response) => {
  const students = await db.Student.findAll({})
  response.status(200).json(students) // todo: formatointi
})

studentsRouter.post('/', async (request, response) => {
  const body = request.body
  try {
    // check if course exists in db
    let course = await db.Course.findOne({
      where: {
        learningopportunity_id: body.learningopportunity_id,
        period: body.period.toString()
      }
    })

    if (!course) {
      course = await db.Course.create({
        learningopportunity_id: body.learningopportunity_id,
        course_name: body.course_name,
        period: body.period,
        year: body.year
      }).catch(new Sequelize.ValidationError, error => {
        response.status(400).json(error)
      }).catch(new Sequelize.DatabaseError, error => {
        response.status(400).json(error)
      })
    }

    // check if user exists in db
    let student = await db.Student
      .findByPk(body.student_id)

    if (!student) {
      student = await db.Student.create({
        student_id: body.student_id,
        first_name: body.first_name,
        last_name: body.last_name,
        nickname: body.nickname,
        phone: body.phone,
        email: body.email
      }).catch(new Sequelize.ValidationError, error => {
        response.status(400).json(error)
      }).catch(new Sequelize.DatabaseError, error => {
        response.status(400).json(error)
      })

      await student.addCourse(course)
    } else {
      await student.addCourse(course)
    }

    response.status(201).json({ student })
  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'bad request' })
  }
})

studentsRouter.get('/:id', async (request, response) => {
  const student = await db.Student
    .findByPk(request.params.id)
  response.status(200).json({ student })
})

studentsRouter.delete('/:id', async (request, response) => {
  try {
    await db.Student.destroy({ where: { student_id: request.params.id } })
    response.status(204).end()

  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'bad request' })
  }
})

module.exports = studentsRouter