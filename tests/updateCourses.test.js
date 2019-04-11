const db = require('../models/index')
const axios = require('axios')
const sort = require('fast-sort')
const updateCourses = require('../utils/middleware/updateCourses').updateCourses
const makeCourseArray = require('./test_helper').makeCourseArray
let courses = null

describe('tests for updating courses', () => {
  jest.setTimeout(15000)
  beforeAll(async () => {
    await db.Course.destroy({
      where: {}
    })  
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