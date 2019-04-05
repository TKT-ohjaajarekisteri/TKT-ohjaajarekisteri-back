const studentsRouter = require('express').Router()
const db = require('../models/index')
const { checkUser, checkAdmin } = require('../utils/middleware/checkRoute')

//Get request that returns all students as JSON
studentsRouter.get('/', checkAdmin, async (req, res) => {
  let students = await db.Student.findAll({})
  res.status(200).json(students) // todo: formatointi
})

//Get request that returns a student based on id
studentsRouter.get('/:id', checkUser, async (req, res) => {
  const user = await db.User
    .findByPk(req.params.id)
  const student = await db.Student
    .findByPk(user.role_id)
  res.status(200).json(student)
})

//Get request that returns all of the courses a student is on
studentsRouter.get('/:id/courses', checkUser, async (req, res) => {
  const user = await db.User
    .findByPk(req.params.id)
  const student = await db.Student
    .findByPk(user.role_id)
  const courses = await student.getCourses()

  res.status(200).json(courses)
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



//Delete request that deletes a student from the database based on id
studentsRouter.delete('/:id', checkUser, async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { user_id: req.params.id } })
    await db.Student.destroy({ where: { student_id: user.role_id } })
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

    await student.update({ email: body.email, phone: body.phone, experience: body.experience, no_english: body.no_english })
    res.status(200).end()

  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'bad req' })
  }
})

//Only for development
studentsRouter.put('/:id/deleteCD', async (req, res) => {
  try {
    let student = await db.Student.findOne({ where: { student_id: req.params.id } })

    await student.update({ nickname: null, email: null, phone: null })
    res.status(200).end()

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