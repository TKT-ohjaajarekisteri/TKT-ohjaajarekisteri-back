const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Student = require('../models/student')
const { initialStudents, studentsInDb } = require('./test_helper')

    describe('when there is initially some students saved', async () => {
        beforeAll(async () => {
        await Student.remove({})
    
        const studentObjects = initialStudents.map(n => new Student(n))
        await Promise.all(studentObjects.map(n => n.save()))
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
            student_id: "a1504505",
            first_name: "Pekka",
            last_name: "Ranta",
            nickname: "Pekka",
            phone: "0445634567",
            email: "pekka.ranta@gmail.com"
          }
    
          await api
            .post('/api/students')
            .send(newStudent)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
          const studentsAfterOperation = await studentsInDb()
    
          expect(studentsAfterOperation.length).toBe(studentsAtStart.length + 1)
    
          const contents = studentsAfterOperation.map(r => r.first_name)
          expect(contents).toContain('Pekka')
        })
    
        test('POST /api/students fails with proper statuscode if student id is missing', async () => {

          const newStudent = {
            first_name: "Pekka",
            last_name: "Ranta",
            nickname: "Pekka",
            phone: "0445634567",
            email: "pekka.ranta@gmail.com"
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
            student_id: "a1504505",
            last_name: "Ranta",
            nickname: "Pekka",
            phone: "0445634567",
            email: "pekka.ranta@gmail.com"
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
            student_id: "a1504505",
            first_name: "Pekka",
            nickname: "Pekka",
            phone: "0445634567",
            email: "pekka.ranta@gmail.com"
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
            student_id: "a1504505",
            first_name: "Pekka",
            last_name: "Ranta",
            phone: "0445634567",
            email: "pekka.ranta@gmail.com"
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
            student_id: "a1504505",
            first_name: "Pekka",
            last_name: "Ranta",
            nickname: "Pekka",
            phone: "0445634567"
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

    beforeAll(async () => {
      let addedStudent = {
        student_id: "a1504505",
        first_name: "Jouni",
        last_name: "Ranta",
        nickname: "Jouni",
        phone: "0445634767",
        email: "jouni.ranta@gmail.com"
      }

      await api
      .post('/api/students')
      .send(addedStudent)
    })

    test('DELETE /api/students/:id succeeds with proper statuscode', async () => {
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

