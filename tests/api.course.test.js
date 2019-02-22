const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
let token = null

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
  })

  describe('When database is empty', () => {
  
    test('Courses are updated correctly', async () => {
      const response = await api
        .get('/api/courses/update')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      expect(response.body.length).toBeGreaterThan(0)
    })

    test('Courses are returned as json by GET /api/courses', async () => {

      const response = await api
        .get('/api/courses')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      expect(response.body.length).toBeGreaterThan(0) 
    })
  })
})