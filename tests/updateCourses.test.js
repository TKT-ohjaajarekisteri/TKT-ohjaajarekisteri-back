const db = require('../models/index')
const config = require('../config/config')
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

    const candidateDataJson = await axios.get(config.candidateCoursesUrl)
    const masterDataJson = await axios.get(config.masterCoursesUrl)
    const dataScienceDataJson = await axios.get(config.dataScienceCoursesUrl)

    courses = makeCourseArray(candidateDataJson.data.concat(masterDataJson.data).concat(dataScienceDataJson.data))
  })

  describe('When database is empty', () => {
  
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