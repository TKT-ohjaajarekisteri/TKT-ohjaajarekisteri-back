const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const { initialStudents, studentsInDb, initialCourses, coursesInDb } = require('./test_helper')

describe('student tests', async () => {
  beforeAll(async () => {
    //await db.sequelize.sync({force:true})
    await db.Student.destroy({
      where: {}
    })
  })
  describe('when there is initially some students saved', async () => {
    beforeAll(async () => {
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
        student_number: 'a2352332',
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

    test('POST /api/students fails with proper statuscode if student number is missing', async () => {

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
        student_number: 'a1504525',
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
        student_number: 'a1504567',
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
        student_number: 'a1500512',
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
        student_number: 'a1504421',
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
        student_number: 'a1539505',
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
})

describe('course tests', async () => {
  beforeAll(async () => {
    await db.Course.destroy({
      where: {}
    })
  })
  describe('when there is initially some courses saved', async () => {
    beforeAll(async () => {
      await Promise.all(initialCourses.map(n => db.Course.create( n )))
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

  describe('adding a new course', async () => {

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

  describe('deleting a course', async () => {

    test('DELETE /api/courses/:id succeeds with proper statuscode', async () => {
      const addedCourse = await db.Course.create({
        learningopportunity_id: 'tito2016',
        course_name: 'Käyttöjärjestelmät',
        period: 2,
        year: 2016
      })

      const coursesAtStart = await coursesInDb()

      await api
        .delete(`/api/courses/${addedCourse.course_id}`)
        .expect(204)

      const coursesAfterOperation = await coursesInDb()

      const contents = coursesAfterOperation.map(r => r.course_name)

      expect(contents).not.toContain(addedCourse.course_name)
      expect(coursesAfterOperation.length).toBe(coursesAtStart.length - 1)
    })
  })

  afterAll(async done => {
    done();
  });

})