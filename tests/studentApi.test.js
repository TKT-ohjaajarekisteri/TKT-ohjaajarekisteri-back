const { app, server } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const { initialStudents, studentsInDb } = require('./test_helper')

describe('when there is initially some students saved', async () => {
  beforeAll(async () => {
    await db.Student.destroy({
      where: {}
    })
    await Promise.all(initialStudents.map(n => db.Student.create( n )))
  })

  test('all students are returned as json by GET /api/students', async () => {
    const studentsInDatabase = await studentsInDb()
    const response = await api
      .get('/api/students')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(studentsInDatabase.length)

    const returnedContents = response.body.map(n => n.first_name)
    studentsInDatabase.forEach(student => {
      expect(returnedContents).toContain(student.first_name)
    })
  })
})

describe('adding a new student', async () => {

  test('POST /api/students succeeds with valid data', async () => {
    const studentsAtStart = await studentsInDb()

    const newStudent = {
      student_id: 'a2352332',
      first_name: 'Pekka',
      last_name: 'Ranta',
      nickname: 'Pekka',
      learningopportunity_id: 'TKT30508',
      course_name: 'Ohjelmistotuotanto 9',
      phone: '0445634567',
      email: 'pekka.ranta@gmail.com',
      period: 3,
      year: 2018
    }

    await api
      .post('/api/students')
      .send(newStudent)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const studentsAfterOperation = await studentsInDb()

    expect(studentsAfterOperation.length).toBe(studentsAtStart.length + 1)

    const contents = studentsAfterOperation.map(r => r.first_name)
    expect(contents).toContain('Pekka')
  })

  test('POST /api/students fails with proper statuscode if student id is missing', async () => {

    const newStudent = {
      first_name: 'Pekka',
      last_name: 'Ranta',
      nickname: 'Pekka',
      learningopportunity_id: 'TKT31508',
      course_name: 'Ohjelmistotuotanto 9',
      phone: '0445634567',
      email: 'pekka.ranta@gmail.com',
      period: 3,
      year: 2018
    }

    const studentsAtStart = await studentsInDb()

    await api
      .post('/api/students')
      .send(newStudent)
      .expect(400)

    const studentsAfterOperation = await studentsInDb()

    expect(studentsAfterOperation.length).toBe(studentsAtStart.length)
  })

  test('POST /api/students fails with proper statuscode if first name is missing', async () => {

    const newStudent = {
      student_id: 'a1504525',
      last_name: 'Ranta',
      nickname: 'Pekka',
      learningopportunity_id: 'TKT32508',
      course_name: 'Ohjelmistotuotanto 9',
      phone: '0445634567',
      email: 'pekka.ranta@gmail.com',
      period: 3,
      year: 2018
    }

    const studentsAtStart = await studentsInDb()

    await api
      .post('/api/students')
      .send(newStudent)
      .expect(400)

    const studentsAfterOperation = await studentsInDb()

    expect(studentsAfterOperation.length).toBe(studentsAtStart.length)
  })

  test('POST /api/students fails with proper statuscode if last name is missing', async () => {

    const newStudent = {
      student_id: 'a1504567',
      first_name: 'Pekka',
      nickname: 'Pekka',
      learningopportunity_id: 'TKT30568',
      course_name: 'Ohjelmistotuotanto 9',
      phone: '0445634567',
      email: 'pekka.ranta@gmail.com',
      period: 3,
      year: 2018
    }

    const studentsAtStart = await studentsInDb()

    await api
      .post('/api/students')
      .send(newStudent)
      .expect(400)

    const studentsAfterOperation = await studentsInDb()

    expect(studentsAfterOperation.length).toBe(studentsAtStart.length)
  })

  test('POST /api/students fails with proper statuscode if nickname is missing', async () => {

    const newStudent = {
      student_id: 'a1500512',
      first_name: 'Pekka',
      last_name: 'Ranta',
      learningopportunity_id: 'TKT30548',
      course_name: 'Ohjelmistotuotanto 15',
      phone: '0445634567',
      email: 'pekka.ranta@gmail.com',
      period: 3,
      year: 2018
    }

    const studentsAtStart = await studentsInDb()

    await api
      .post('/api/students')
      .send(newStudent)
      .expect(400)

    const studentsAfterOperation = await studentsInDb()

    expect(studentsAfterOperation.length).toBe(studentsAtStart.length)
  })

  test('POST /api/students fails with proper statuscode if email is missing', async () => {

    const newStudent = {
      student_id: 'a1504421',
      first_name: 'Pekka',
      last_name: 'Ranta',
      learningopportunity_id: 'TKT30508',
      course_name: 'Ohjelmistotuotanto 54',
      nickname: 'Pekka',
      phone: '0445634567',
      period: 3,
      year: 2018
    }

    const studentsAtStart = await studentsInDb()

    await api
      .post('/api/students')
      .send(newStudent)
      .expect(400)

    const studentsAfterOperation = await studentsInDb()

    expect(studentsAfterOperation.length).toBe(studentsAtStart.length)
  })

})

describe('deleting a student', async () => {

  test('DELETE /api/students/:id succeeds with proper statuscode', async () => {
    const addedStudent = await db.Student.create({
      student_id: 'a1539505',
      first_name: 'Jouni',
      last_name: 'Ranta',
      nickname: 'Jouni',
      phone: '0445634767',
      email: 'jouni.ranta@gmail.com',
    })

    const studentsAtStart = await studentsInDb()

    await api
      .delete(`/api/students/${addedStudent.student_id}`)
      .expect(204)

    const studentsAfterOperation = await studentsInDb()

    const contents = studentsAfterOperation.map(r => r.first_name)

    expect(contents).not.toContain(addedStudent.first_name)
    expect(studentsAfterOperation.length).toBe(studentsAtStart.length - 1)
  })
})

