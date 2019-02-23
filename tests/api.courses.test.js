const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const axios = require('axios')
let token = null
let courses = null
let students = null
const index = 0
const { coursesInDb, initialCourses, initialStudents } = require('./test_helper')

describe.skip('tests for the courses controller', () => {
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

    
    const admin = await db.Admin.create({ username: 'testAdmin', password: 'password' })
    const adminUser = await db.User.create({ role: 'admin', role_id: admin.admin_id })
    token = jwt.sign({ id: adminUser.user_id, role: adminUser.role }, config.secret)

    const candidateDataJson = await axios.get(config.candidateCoursesUrl)
    const masterDataJson = await axios.get(config.masterCoursesUrl)
    courses = Object.assign(candidateDataJson.data, masterDataJson.data)
  })

  describe('When database is empty', () => {
  
    test('Courses are updated correctly', async () => {

      const response = await api
        .get('/api/courses/update')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body).toBeDefined()
      expect(JSON.stringify(courses[0].learningopportunity_id)).toEqual(JSON.stringify(response.body[0].learningopportunity_id))
      expect(JSON.stringify(courses[1].learningopportunity_id)).toEqual(JSON.stringify(response.body[1].learningopportunity_id))

    })
  })

  describe('When database has courses', () => {
    beforeAll(async () => {
      await db.Course.destroy({
        where: {}
      })  
      courses = await Promise.all(initialCourses.map(n => db.Course.create( n )))
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
        .get('/api/courses')
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

        students = await Promise.all(initialStudents.map(n => db.Student.create( n )))

        await students[index].addCourse(courses[index])
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
    })  
  })
})