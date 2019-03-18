const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { initialStudents, studentsInDb, initialCourses, passwordHasher } = require('./test_helper')
let token = null
let students = null
let courses = null
let users = null
let studentToken = null
const index = 0

describe('tests for the students controller', () => {
  jest.setTimeout(15000)
  beforeAll(async () => {
    await db.User.destroy({
      where: {}
    })
  
    await db.Admin.destroy({
      where: {}
    })

    const admin = await db.Admin.create({ username: 'testAdmin', passwordHash: passwordHasher('password') })
    const adminUser = await db.User.create({ role: 'admin', role_id: admin.admin_id })
    token = jwt.sign({ id: adminUser.user_id, role: adminUser.role }, config.secret)
  })

  describe('When database has students', () => {
    beforeAll(async () => {
      await db.Student.destroy({
        where: {}
      })  

      students = await Promise.all(initialStudents.map(n => db.Student.create(n)))
      users = await Promise.all(students.map(student => db.User.create({ role: 'student', role_id: student.student_id })))
      studentToken = jwt.sign({ id: users[index].user_id, role: users[index].role }, config.secret)
    })

    test('Student is returned as json by GET /api/students/:user_id', async () => {
      const response = await api
        .get(`/api/students/${users[index].user_id}`)
        .set('Authorization', `bearer ${studentToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.text).toBeDefined()
      expect(response.text).toContain(students[index].student_number)
    })

    test('Students are returned as json by GET /api/students', async () => {
      const studentsInDatabase = await studentsInDb()

      const response = await api
        .get('/api/students')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      expect(response.body.length).toBe(studentsInDatabase.length)

      const returnedContents = response.body.map(n => n.student_number)
      studentsInDatabase.forEach(student => {
        expect(returnedContents).toContain(student.student_number)
      })
    })

    describe('When database has courses and students', () => {
      beforeAll(async () => {
        await db.Course.destroy({
          where: {}
        })  

        courses = await Promise.all(initialCourses.map(n => db.Course.create( n )))
      })

      test('Student can apply to a course with POST /api/students/:id/courses/apply', async () => {
        const response = await api
          .post(`/api/students/${users[index].user_id}/courses/apply`)
          .set('Authorization', `bearer ${studentToken}`)
          .send({ 'course_ids': [courses[index].course_id] })
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const studentWithCourse = await db.Student.findOne({ where: {
          student_id: students[index].student_id
        },
        include: [{ model: db.Course, as: 'courses' }] 
        })

        expect(JSON.stringify(studentWithCourse.courses[index]).learningopportunity_id)
          .toEqual(JSON.stringify(courses[index]).learningopportunity_id)
        expect(response.text).toBeDefined()
        expect(response.text).toContain(courses[index].learningopportunity_id)
      })

    
      describe('When database has an association', () => {
        test('Courses that a student has applied to are listed with GET /api/students/:user_id/courses', async () => {
          const response = await api
            .get(`/api/students/${users[index].user_id}/courses`)
            .set('Authorization', `bearer ${studentToken}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

          expect(response.text).toBeDefined()
          expect(response.text).toContain(courses[index].learningopportunity_id)
        })

        test('Removes relation between a course and a student with DELETE /api/students/:user_id/courses/:course_id', async () => {
          const studentWithCourseAtStart = await db.Student.findOne({ where: {
            student_id: students[index].student_id
          },
          include: [{ model: db.Course, as: 'courses' }] 
          })

          expect(JSON.stringify(studentWithCourseAtStart)).toBeDefined()

          await api
            .delete(`/api/students/${users[index].user_id}/courses/${courses[index].course_id}`)
            .set('Authorization', `bearer ${studentToken}`)
            .expect(204)

          const studentWithCourse = await db.Student.findOne({ where: {
            student_id: students[index].student_id
          },
          include: [{ model: db.Course, as: 'courses' }] 
          })
    
          expect(JSON.stringify(studentWithCourse.courses[index]))
            .toBeUndefined()
        })

        describe('update and delete tests', () => {
          test('Student can update his/her own data with PUT /api/students/:id', async () => {
            await api
              .put(`/api/students/${users[index].user_id}`)
              .set('Authorization', `bearer ${studentToken}`)
              .send({ email: 'maili@hotmail.com', phone: '0402356543', teachInEnglish: 'true', experience: 'very good' })
              .expect(201)
      
            const updatedStudent = await db.Student.findOne({ where: { student_id: students[index].student_id } })
            expect(updatedStudent).not.toContain(students[index].phone)
            expect(updatedStudent.phone).toBe('0402356543')
            expect(updatedStudent.experience).toBe('very good')
          })
      
          test('Student can delete his/her own data with DELETE /api/students/:id', async () => {
            const studentsAtStart = await studentsInDb()
      
            await api
              .delete(`/api/students/${users[index].user_id}`)
              .set('Authorization', `bearer ${studentToken}`)
              .expect(204)
      
            const studentsAfterOperation = await studentsInDb()
      
            const contents = studentsAfterOperation.map(r => r.first_names)
      
            expect(contents).not.toContain(students[index].first_names)
            expect(studentsAfterOperation.length).toBe(studentsAtStart.length - 1)
          })
        })
      })
    })
  })
})