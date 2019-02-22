const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')

describe.skip('tests for the courses controller', () => {
  beforeAll(async () => {
    await db.Course.destroy({
      where: {}
    })  
  })

  describe('When database is empty', () => {
  
    test('Courses are updated correctly', async () => {

      const response = await api
        .get('/api/courses/update')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      expect(response.body.length).toBeGreaterThan(0)
    })

    test('Courses are returned as json by GET /api/courses', async () => {

      const response = await api
        .get('/api/courses')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      expect(response.body.length).toBeGreaterThan(0) 
    })
  })
})