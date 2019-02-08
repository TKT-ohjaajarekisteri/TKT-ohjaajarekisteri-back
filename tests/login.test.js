const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const { initialUsers, initialStudents, initialAdmins, usersInDb } = require('./test_helper')

describe('login tests', async () => {
  test('cannot login with missing username /api/login', async () => {
    const response = await api
      .post('/api/login', {username: "", password: "wrong"})
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })

  test('cannot login with missing password /api/login', async () => {
    const response = await api
      .post('/api/login', {username: "test", password: ""})
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })
})