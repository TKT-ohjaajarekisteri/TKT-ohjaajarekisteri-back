const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
let token = null
let studentToken = null
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

    await db.Student.destroy({
      where: {}
    })

    const admin = await db.Admin.create({ username: 'testAdmin', passwordHash: passwordHasher('password') })
    const adminUser = await db.User.create({ role: 'admin', role_id: admin.admin_id })
    token = jwt.sign({ id: adminUser.user_id, role: adminUser.role }, config.secret)

    const student = await db.Student.create(initialStudents[0])
    const studentUser = await db.User.create({ role: 'student', role_id: student.student_id })
    studentToken = jwt.sign({ id: studentUser.user_id, role: studentUser.role }, config.secret)
  })

  describe('When database has courses', () => {
    beforeEach(async () => {
      await db.Course.destroy({
        where: {}
      })
      await db.Student.destroy({
        where: {}
      })

      const student = await db.Student.create(initialStudents[0])
      const studentUser = await db.User.create({ role: 'student', role_id: student.student_id })
      studentToken = jwt.sign({ id: studentUser.user_id, role: studentUser.role }, config.secret)

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

    test('Courses are returned as json by GET /api/courses/all', async () => {
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

    test('Course can be hidden by PUT /api/courses/:id/hide', async () => {
      const response = await api
        .put(`/api/courses/${courses[index].course_id}/hide`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.hidden).toBeTruthy()
    })

    test('Hidden courses are not returned for students by GET /api/courses/', async () => {
      const coursesInDatabase = await coursesInDb()
      await courses[index].update({ hidden: true })
      const response = await api
        .get('/api/courses/')
        .set('Authorization', `bearer ${studentToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(coursesInDatabase.length - 1)
      expect(response).not.toContain(courses[index].course_id)
    })

    test('Course can be unhidden by PUT /api/courses/:id/hide', async () => {
      await courses[index].update({ hidden: true })
      const response = await api
        .put(`/api/courses/${courses[index].course_id}/hide`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.hidden).toBeFalsy()
    })

    test('Empty applicant list is returned via COURSE request', async () => {
      const response = await api
        .get('/api/courses')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(JSON.parse(response.text)[index].students.length).toEqual(0)
    })
  })
  
  describe('When database has courses, students and an association', () => {
    beforeEach(async () => {
      await db.Course.destroy({
        where: {}
      })

      await db.Student.destroy({
        where: {}
      })

      courses = await Promise.all(initialCourses.map(n => db.Course.create(n)))

      students = await Promise.all(initialStudents.map(n => db.Student.create(n)))
      await courses[index].addStudents(students)
    })

    test('Students that have applied to course are listed with GET /api/courses/:course_id/students', async () => {
      const response = await api
        .get(`/api/courses/${courses[index].course_id}/students`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toBeDefined()
      expect(response.text).toContain(students[index + 2].student_number)
    })

    test('Applying students can be accepted as assistants with POST /api/courses/:course_id/students', async () => {
      const studentsToAccept = await students.map(student => {
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

  describe('When database has courses, students and an association is added', () => {
    beforeEach(async () => {
      await db.Student.destroy({
        where: {}
      })
      await db.Course.destroy({
        where: {}
      })

      students = await Promise.all(initialStudents.map(n => db.Student.create(n)))
      courses = await Promise.all(initialPastCourses.map(n => db.Course.create(n)))
      await students[index].addCourse(courses[index])
    })

    test('applicant list is returned via summary request', async () => {
      const response = await api
        .get('/api/courses/summary')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toContain('students')
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

    test('Applicant list is returned via SUMMARY request', async () => {
      await students[index].addCourse(courses[index])
      const test_student = initialStudents[index]

      const response = await api
        .get('/api/courses/summary')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toContain(test_student.email)
    })

    test('Applicant list is returned via COURSE request for admin', async () => {
      await students[index].addCourse(courses[index])
      const test_student = students[index]

      const response = await api
        .get('/api/courses')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
      expect(response.text).toContain(test_student.student_id)
    })

    test('Applicant list is not returned via COURSE request for students', async () => {
      await students[index].addCourse(courses[index])
      const test_student = students[index]

      const response = await api
        .get('/api/courses')
        .set('Authorization', `bearer ${studentToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
      expect(response.text).not.toContain(test_student.student_id)
    })    
  })
})