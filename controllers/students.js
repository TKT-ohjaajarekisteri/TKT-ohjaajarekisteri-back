const studentsRouter = require('express').Router()
const db = require('../models/index')
const { checkUser, checkAdmin } = require('../utils/middleware/checkRoute')


//Get request that returns all students as JSON
studentsRouter.get('/', checkAdmin, async (req, res) => {
  try {
    let students = await db.Student.findAll({})
    res.status(200).json(students)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'Could not get studentlist from db' })
  }
})

//Get request that returns a student based on id
studentsRouter.get('/:id', checkUser, async (req, res) => {
  try {
    const user = await db.User
      .findByPk(req.params.id)
    const student = await db.Student
      .findByPk(user.role_id)
    res.status(200).json(student)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'Could not get student from db' })
  }
})

//Get request that returns a student based on id for admin
studentsRouter.get('/:id/info', checkAdmin, async (req, res) => {
  try {
    const student = await db.Student
      .findByPk(req.params.id)
    res.status(200).json(student)
  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'Could not get student from db' })
  }
})

//Get request that returns all of the courses a student is on
studentsRouter.get('/:id/courses', checkUser, async (req, res) => {
  try {
    const user = await db.User
      .findByPk(req.params.id)
    const student = await db.Student
      .findByPk(user.role_id)
    const courses = await student.getCourses()
    res.status(200).json(courses)
  } catch (exception) {
    res.status(400).json({ error: 'Could not get the course list from db' })
  }
})

//Get request that returns all of the courses a student is on for admin
studentsRouter.get('/:id/info/courses', checkAdmin, async (req, res) => {
  try {
    const student = await db.Student
      .findByPk(req.params.id)
    const courses = await student.getCourses()
    res.status(200).json(courses)
  } catch (exception) {
    res.status(400).json({ error: 'Could not get the course list from db' })
  }
})

// Adds student to given courses
studentsRouter.post('/:id/courses/apply', checkUser, async (req, res) => {
  const body = req.body
  try {
    // get current user from db
    const user = await db.User.findOne({
      where: {
        user_id: req.params.id
      }
    })
    const student = await db.Student.findOne({
      where: {
        student_id: user.role_id
      }
    })

    // finds all courses with given course id, and adds them to the student-course association table
    const applied = await Promise.all(body.course_ids.map(async course_id => {
      const course = await db.Course.findOne({
        where: {
          course_id: course_id
        }
      })
      // sequelize method that creates a association for student - course
      await student.addCourse(course)
      return course
    }))
    res.status(201).json(applied)

  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'bad req' })
  }

})

// Removes relation between student and course
studentsRouter.delete('/:id/courses/:course_id', checkUser, async (req, res) => {
  try {
    // get current user from db
    const user = await db.User.findOne({
      where: {
        user_id: req.params.id
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
        course_id: req.params.course_id
      }
    })

    // sequelize method to severe connection from assossication table
    await student.removeCourse(course)
    res.status(204).end()

  } catch (exception) {
    console.log(exception.message)
    res.status(400).json({ error: 'bad request' })
  }
})


//Delete request for Admin that deletes a student from database with student number
studentsRouter.delete('/admin/:student_number', checkAdmin, async (req, res) => {
  try {
    const student = await db.Student.findOne({ where: { student_number: req.params.student_number } })
    await db.User.destroy({ where: { role_id: student.student_id, role: 'student' } })
    await db.Student.destroy({ where: { student_id: student.student_id } })
    res.status(204).end()

  } catch (exception) {
    console.log(exception)
    res.status(400).json({ error: 'bad req' })
  }
})

//Updates students contact details
studentsRouter.put('/:id', checkUser, async (req, res) => {
  try {
    let user = await db.User.findOne({ where: { user_id: req.params.id } })
    let student = await db.Student.findOne({ where: { student_id: user.role_id } })
    const body = req.body

    await student.update({ email: body.email, phone: body.phone, experience: body.experience, no_english: body.no_english, apprentice: body.apprentice })
    res.status(200).end()
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

//Hides a course if it is not hidden and makes it visible if it is hidden.
studentsRouter.put('/:id/:course_id/hide', checkUser, async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { user_id: req.params.id } })
    const student = await db.Student.findOne({ where: { student_id: user.role_id } })
    let application = await db.Application.findOne({ where: { course_id: req.params.course_id, student_id: student.student_id } })

    application = await application.update({ hidden: !application.hidden })
    res.status(200).json(application)
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

/* //Delete request that deletes a student from the database based on id
studentsRouter.delete('/:id', checkUser, async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { user_id: req.params.id } })
    await db.Student.destroy({ where: { student_id: user.role_id } })
    await db.User.destroy({ where: { user_id: user.user_id } })
    res.status(204).end()

  } catch (exception) {
    console.log(exception)
    res.status(400).json({ error: 'bad req' })
  }
}) */

//Only for development

/* studentsRouter.put('/:id/deleteCD', async (req, res) => {
  try {
    let student = await db.Student.findOne({ where: { student_id: req.params.id } })

    await student.update({ nickname: null, email: null, phone: null })
    res.status(200).end()

  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
}) */

module.exports = studentsRouter