const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const config = require('../config/config')
const axios = require('axios')
const sort = require('fast-sort')
const jwt = require('jsonwebtoken')
const { passwordHasher } = require('./test_helper')
const updateCourses = require('../utils/middleware/updateCourses').updateCourses
const makeCourseArray = require('./test_helper').makeCourseArray
let courses = null
let token = null

describe('tests for updating courses', () => {
  jest.setTimeout(15000)
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

    const admin = await db.Admin.create({ username: 'testAdmin', passwordHash: passwordHasher('password') })
    const adminUser = await db.User.create({ role: 'admin', role_id: admin.admin_id })
    token = jwt.sign({ id: adminUser.user_id, role: adminUser.role }, config.secret)
  })

  describe('When database is empty', () => {
  
    test('New study program urls are created correctly', async () => { 
      await api
        .put('/api/studyProgramUrls')
        .set('Authorization', `bearer ${token}`)
        .send({ 'type':'test', 'url':'www.testi.fi' })
        .expect(201)

      const studyProgramUrl = await db.StudyProgramUrl.findOne({ where: { type: 'test' } })
      expect(studyProgramUrl.url).toContain('www.testi.fi')
    })

    test('Existing study program urls are updated correctly', async () => { 
      await api
        .put('/api/studyProgramUrls')
        .set('Authorization', `bearer ${token}`)
        .send({ 'type':'test', 'url':'www.testi2.fi' })
        .expect(200)

      const studyProgramUrl = await db.StudyProgramUrl.findOne({ where: { type: 'test' } })
      expect(studyProgramUrl.url).toContain('www.testi2.fi')
    })

    describe('When database has study program urls', () => {
      beforeAll(async () => {
        await db.StudyProgramUrl.destroy({
          where: {}
        })

        const candidate = await db.StudyProgramUrl.create({ type: 'candidate', url: 'https://studies.helsinki.fi/organizations/500-K005/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching' })
        const master = await db.StudyProgramUrl.create({ type: 'master', url: 'https://studies.helsinki.fi/organizations/500-M009/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching' })
        const dataScience = await db.StudyProgramUrl.create({ type: 'data', url: 'https://studies.helsinki.fi/organizations/500-M010/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching' })

        const candidateDataJson = await axios.get(candidate.url)
        const masterDataJson = await axios.get(master.url)
        const dataScienceDataJson = await axios.get(dataScience.url)
    
        courses = makeCourseArray(candidateDataJson.data.concat(masterDataJson.data).concat(dataScienceDataJson.data))
      })

      test('Courses are updated correctly', async () => {
        const updatedCourses = await updateCourses()

        sort(updatedCourses).asc([
          'learningopportunity_id', // Sort by ID
          'period', // courses with the same ID are sorted by period
        ])
        sort(courses).asc([
          'learningopportunity_id', // Sort by ID
          'period', // courses with the same ID are sorted by period
        ])

        expect(JSON.stringify(courses[0].learningopportunity_id)).toEqual(JSON.stringify(updatedCourses[0].learningopportunity_id))
        expect(JSON.stringify(courses[1].learningopportunity_id)).toEqual(JSON.stringify(updatedCourses[1].learningopportunity_id))
        expect(JSON.stringify(courses[1].period)).toEqual(JSON.stringify(updatedCourses[1].period))

      })

      test('No new courses are added, when updated twice in a row', async () => { 
        const updatedCourses = await updateCourses()
        expect(updatedCourses.length).toEqual(0)
      })

    })
  })
})