const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const axios = require('axios')
const sort = require('fast-sort')
let token = null
let courses = null
let students = null
const index = 0
const { coursesInDb, initialPastCourses, passwordHasher } = require('./test_helper')


describe('tests for the courses controller for past courses', () => {
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

    const candidateDataJson = await axios.get(config.candidateCoursesUrl)
    const masterDataJson = await axios.get(config.masterCoursesUrl)
    courses = candidateDataJson.data.concat(masterDataJson.data)
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
})
