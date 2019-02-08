const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const { initialUsers, initialStudents, initialAdmins } = require('./test_helper')

describe('/api/login', async () => {
  beforeAll(async () => {
    await db.User.destroy({
      where: {}
    })

    await db.Student.destroy({
      where: {}
    })

    await db.Admin.destroy({
      where: {}
    })

    await Promise.all(initialStudents.map(async s => await db.Student.create(s)))

    await Promise.all(initialUsers.map(async u => await db.User.create(u)))
    
    await Promise.all(initialAdmins.map(async a => await db.Admin.create(a)))
  })

  test('cannot login with missing username', async () => {
    const response = await api
      .post('/api/login', { username: "", password: "wrong" })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })

  test('cannot login with missing password', async () => {
    const response = await api
      .post('/api/login', { username: "test", password: "" })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })

  test('can login with existing admin credentials', async () => {
    const response = await api
      .post('/api/login', { username: "test", password: "" })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })

  test('correct error with wrong admin credentials', async () => {
    const response = await api
      .post('/api/login', { username: "test", password: "" })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })

  test('can login with existing student credentials', async () => {

  })

  test('correct error with existing admin credentials', async () => {

  })

  test('can login with existing admin credentials', async () => {

  })

  test('can login with existing admin credentials', async () => {

  })
  
  test('can login with existing admin credentials', async () => {

  })
})