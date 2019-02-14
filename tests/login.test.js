const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { initialStudents, initialAdmins, usersInDb, studentsInDb, deleteUser } = require('./test_helper')

describe('/api/login', async () => {
  beforeEach(async () => {
    await db.User.destroy({
      where: {}
    })

    await db.Student.destroy({
      where: {}
    })

    await db.Admin.destroy({
      where: {}
    })

    await Promise.all(initialAdmins.map(async admin => {
      await db.Admin.create(admin)
        .then(savedAdmin => {
          db.User.create({ role: 'admin', role_id: savedAdmin.admin_id })
        })
    }))

    await Promise.all(initialStudents.map(async student => {
      await db.Student.create(student).then(savedStudent => {
        db.User.create({ role: 'student', role_id: savedStudent.student_id })
      })
    }))
  })

  test('cannot login with missing username', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: '', password: 'wrong' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })

  test('cannot login with missing password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'test', password: '' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('missing username or password')
  })

  test('returns correct token and user with existing admin credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testAdmin', password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    let decodedToken = jwt.verify(response.body.token, config.secret)
    let users = await usersInDb()
    let user_id = users.find(u => u.role === 'admin').user_id

    expect(decodedToken.id).toBe(user_id)
    expect(response.body.user).toEqual({ user_id: user_id, role: 'admin' })
  })

  test('correct error with incorrect admin credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testAdmin', password: 'passwood' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('incorrect credentials')
  })

  test('returns correct token and user with existing student credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'poju', password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    let decodedToken = jwt.verify(response.body.token, config.secret)
    let students = await studentsInDb()
    let student_id = students.find(s => s.student_number === '123456789').student_id
    
    let users = await usersInDb()
    let user_id = users.find(u => u.role_id === student_id).user_id

    expect(decodedToken.id).toBe(user_id)
    expect(response.body.user).toEqual({ user_id: user_id, role: 'student', email: true })
  })

  test('correct error with incorrect student credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'pohu', password: 'password' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('incorrect credentials')
  })

  test('when loggin in first time with correct student credentials a user is created', async () => {
    await deleteUser('123456789')
    let usersBefore = await usersInDb()
    expect(usersBefore.length).toBe(3)

    const response = await api
      .post('/api/login')
      .send({ username: 'poju', password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    let usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(4)

    let decodedToken = jwt.verify(response.body.token, config.secret)
    let students = await studentsInDb()
    let student_id = students.find(s => s.student_number === '123456789').student_id
    
    let users = await usersInDb()
    let user_id = users.find(u => u.role_id === student_id).user_id
    
    expect(decodedToken.id).toBe(user_id)
    expect(response.body.user).toEqual({ user_id: user_id, role: 'student', email: false })
  })
})