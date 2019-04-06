const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
let token = null
let courses = null
let students = null
const index = 0
const { coursesInDb, initialCourses, initialStudents, passwordHasher, initialPastCourses } = require('./test_helper')

describe('tests for the courses controller', () => {
  jest.setTimeout(15000)
  beforeAll(async () => {
    await db.Course.destroy({
      where: {}
    })

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

  describe('When database has courses', () => {
    beforeAll(async () => {
      await db.Course.destroy({
        where: {}
      })
      courses = await Promise.all(initialCourses.map(n => db.Course.create(n)))
    })

    test('Course is returned as json by GET /api/courses/:course_id', async () => {
      const response = await api
        .get(`/api/courses/${courses[index].course_id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toBeDefined()
      expect(response.text).toContain(courses[index].learningopportunity_id)
    })

    test('Courses are returned as json by GET /api/courses', async () => {
      const coursesInDatabase = await coursesInDb()

      const response = await api
        .get('/api/courses/all')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(coursesInDatabase.length)

      const returnedContents = response.body.map(n => n.course_name)
      coursesInDatabase.forEach(course => {
        expect(returnedContents).toContain(course.course_name)
      })
    })

    describe('When database has courses, students and an association', () => {
      beforeAll(async () => {
        await db.Student.destroy({
          where: {}
        })
        students = await Promise.all(initialStudents.map(n => db.Student.create(n)))
        students.forEach(async student =>
          await student.addCourse(courses[index])
        )
      })

      test('Students that have applied to course are listed with GET /api/courses/:course_id/students', async () => {
        const response = await api
          .get(`/api/courses/${courses[index].course_id}/students`)
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.text).toBeDefined()
        expect(response.text).toContain(students[index].student_number)
      })

      test('Applying students can be accepted as assistants with POST /api/courses/:course_id/students', async () => {
        const studentsToAccept = students.map(student => {
          return {
            student_id: student.student_id,
            accepted: true,
            groups: 0
          }
        })
        const response = await api
          .post(`/api/courses/${courses[index].course_id}/students`)
          .set('Authorization', `bearer ${token}`)
          .send(studentsToAccept)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        expect(response.text).toBeDefined()
        expect(response.text).toContain(studentsToAccept[0].student_id)
        expect(response.text).toContain(studentsToAccept[1].student_id)
        expect(response.text).toContain(studentsToAccept[0].accepted)
        expect(response.text).toContain(studentsToAccept[1].accepted)
      })

      test('Group numbers can be changed with POST /api/courses/:course_id/students', async () => {
        const updatedGroupNumber = 17
        const studentsToAccept = students.map(student => {
          return {
            student_id: student.student_id,
            accepted: true,
            groups: updatedGroupNumber
          }
        })
        const response = await api
          .post(`/api/courses/${courses[index].course_id}/students`)
          .set('Authorization', `bearer ${token}`)
          .send(studentsToAccept)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        expect(response.text).toBeDefined()
        expect(response.text).toContain(studentsToAccept[0].student_id)
        expect(response.text).toContain(studentsToAccept[1].student_id)
        expect(response.text).toContain(studentsToAccept[0].groups)
        expect(response.text).toContain(studentsToAccept[1].groups)
        expect(response.text).toContain(updatedGroupNumber)
      })
    })

    describe('When database has courses', () => {
      beforeAll(async () => {
        await db.Course.destroy({
          where: {}
        })
        courses = await Promise.all(initialPastCourses.map(n => db.Course.create(n)))
      })

      test('Past courses are not returned as json by GET /api/courses', async () => {
        const coursesInDatabase = await coursesInDb()

        const response = await api
          .get('/api/courses')
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(coursesInDatabase.length - 1)
      })
    })
    describe('When database has courses, students and an association is added', () => {
      beforeAll(async () => {
        await db.Student.destroy({
          where: {}
        })

        students = await Promise.all(initialStudents.map(n => db.Student.create(n)))
        await students[index].addCourse(courses[index])
      })
      test('applicant list is returned via summary request', async () => {
        const response = await api
          .get('/api/courses/summary')
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.text).toContain("students")
      })

      test('non-empty applicant list is returned via summary request', async () => {
        await students[index].addCourse(courses[index])
        test_student = initialStudents[index]

        const response = await api
          .get('/api/courses/summary')
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.text).toContain(test_student.email)
      })
    })
  })
})
