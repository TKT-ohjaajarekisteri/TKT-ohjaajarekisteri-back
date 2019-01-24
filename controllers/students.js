const studentsRouter = require('express').Router()
const db = require('../models/index')


studentsRouter.get('/', async (request, response) => {
  const students = await db.Student.findAll({})
  response.status(200).json(students) // todo: formatointi
})

studentsRouter.post('/', async (request, response) => {
  try {

    const student = await db.Student.create({
      student_id: request.body.student_id,
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      nickname: request.body.nickname,
      phone: request.body.phone,
      email: request.body.email
    })
    response.status(201).json({ student })
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

studentsRouter.get('/:id', async (request, response) => {
  const student = await db.Student
    .findByPk(request.params.id)
  response.status(200).json({ student })
})

module.exports = studentsRouter