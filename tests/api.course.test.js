const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const axios = require('axios')
let token = null
let courses = null

describe('tests for the courses controller', () => {
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

      expect(JSON.stringify(courses[0].learningopportunity_id)).toEqual(JSON.stringify(response.body[0].learningopportunity_id))
      expect(JSON.stringify(courses[1].learningopportunity_id)).toEqual(JSON.stringify(response.body[1].learningopportunity_id))

    })

    test('Courses are returned as json by GET /api/courses', async () => {

      const response = await api
        .get('/api/courses')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(JSON.stringify(courses[0].learningopportunity_id)).toEqual(JSON.stringify(response.body[0].learningopportunity_id))
      expect(JSON.stringify(courses[1].learningopportunity_id)).toEqual(JSON.stringify(response.body[1].learningopportunity_id))
    })
  })
})