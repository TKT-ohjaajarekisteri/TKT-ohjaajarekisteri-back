const { app, server } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const { initialCourses, coursesInDb } = require('./test_helper')

describe.skip('when there is initially some courses saved', async () => {
  beforeAll(async () => {
    await db.Course.destroy({
      where: {}
    })
    await initialCourses.map(n => db.Course.create( n ))
  })

  test('all courses are returned as json by GET /api/courses', async () => {
    const coursesInDatabase = await coursesInDb()

    const response = await api
      .get('/api/courses')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(coursesInDatabase.length)

    const returnedContents = response.body.map(n => n.course_name)
    coursesInDatabase.forEach(course => {
      expect(returnedContents).toContain(course.course_name)
    })
  })
})

describe.skip('adding a new course', async () => {

  test('POST /api/courses succeeds with valid data', async () => {
    const coursesAtStart = await coursesInDb()

    const newCourse = {
      learningopportunity_id: 'tito2016',
      course_name: 'Tietokoneen toiminta',
      period: 2,
      year: 2016
    }

    await api
      .post('/api/courses')
      .send(newCourse)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const coursesAfterOperation = await coursesInDb()

    expect(coursesAfterOperation.length).toBe(coursesAtStart.length + 1)

    const contents = coursesAfterOperation.map(r => r.course_name)
    expect(contents).toContain('Tietokoneen toiminta')
  })

  test('POST /api/courses fails with proper statuscode if learning opportunity id is missing', async () => {

    const newCourse = {
      course_name: 'Tietokoneen toiminta',
      period: 2,
      year: 2016
    }

    const coursesAtStart = await coursesInDb()

    await api
      .post('/api/courses')
      .send(newCourse)
      .expect(400)

    const coursesAfterOperation = await coursesInDb()

    expect(coursesAfterOperation.length).toBe(coursesAtStart.length)
  })

  test('POST /api/courses fails with proper statuscode if course name is missing', async () => {

    const newCourse = {
      learningopportunity_id: 'tito2016',
      period: 2,
      year: 2016
    }

    const coursesAtStart = await coursesInDb()

    await api
      .post('/api/courses')
      .send(newCourse)
      .expect(400)

    const coursesAfterOperation = await coursesInDb()

    expect(coursesAfterOperation.length).toBe(coursesAtStart.length)
  })

  test('POST /api/courses fails with proper statuscode if period is missing', async () => {

    const newCourse = {
      learningopportunity_id: 'tito2016',
      course_name: 'Tietokoneen toiminta',
      year: 2016
    }

    const coursesAtStart = await coursesInDb()

    await api
      .post('/api/courses')
      .send(newCourse)
      .expect(400)

    const coursesAfterOperation = await coursesInDb()

    expect(coursesAfterOperation.length).toBe(coursesAtStart.length)
  })

  test('POST /api/courses fails with proper statuscode if year is missing', async () => {

    const newCourse = {
      learningopportunity_id: 'tito2016',
      course_name: 'Tietokoneen toiminta',
      period: 2
    }

    const coursesAtStart = await coursesInDb()

    await api
      .post('/api/courses')
      .send(newCourse)
      .expect(400)

    const coursesAfterOperation = await coursesInDb()

    expect(coursesAfterOperation.length).toBe(coursesAtStart.length)
  })

})

describe.skip('deleting a course', async () => {

  test('DELETE /api/courses/:id succeeds with proper statuscode', async () => {
    await db.Course.Create({
      learningopportunity_id: 'tito2016',
      course_name: 'Tietokoneen toiminta',
      period: 2,
      year: 2016
    })

    const coursesAtStart = await coursesInDb()
    const addedCourse = await db.Course.findOne({
      where: {
        learningopportunity_id: 'tito2016'
      }
    })

    await api
      .delete(`/api/courses/${addedCourse.course_id}`)
      .expect(204)

    const coursesAfterOperation = await coursesInDb()

    const contents = coursesAfterOperation.map(r => r.course_name)

    expect(contents).not.toContain(addedCourse.course_name)
    expect(coursesAfterOperation.length).toBe(coursesAtStart.length - 1)
  })

  afterAll(() => {
    server.close()
  })

})

