const studentsRouter = require('express').Router()
const db = require('../models/index')


//Get request that returns all students as JSON
studentsRouter.get('/', async (request, response) => {
  let students = await db.Student.findAll({})

  // hide student numbers from JSON
  students.forEach(student => {
    student.student_number = ''
  })
  response.status(200).json(students) // todo: formatointi
})

/*Post request that creates a new student and a new course
Also creates a association between the course and student created*/
studentsRouter.post('/', async (request, response) => {
  const body = request.body
  try {
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

    // check if user exists in db
    let student = await db.Student.findOne({
      where: {
        student_number: body.student_number
      }
    })

    if (!student) {
      student = await db.Student.create({
        student_number: body.student_number,
        first_name: body.first_name,
        last_name: body.last_name,
        nickname: body.nickname,
        phone: body.phone,
        email: body.email
      })
      await student.addCourse(course)
    } else {
      await student.addCourse(course)
    }
    student.student_number = ''
    response.status(201).json({
      'student': student,
      'course': course
    })
  } catch (exception) {
    console.log(exception.message)
    response.status(400).json({ error: 'bad request' })
  }
})

//Get request that returns a student based on id
studentsRouter.get('/:id', async (request, response) => {
  const student = await db.Student
    .findByPk(request.params.id)
  response.status(200).json(student)
})

//Delete request that deletes a student from the database based on id
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