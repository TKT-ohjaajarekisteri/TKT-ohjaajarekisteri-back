const db = require('../models/index')
const config = require('../config/config')
const axios = require('axios')
const sort = require('fast-sort')
const updateCourses = require('../utils/middleware/updateCourses').updateCourses
const makeCourseArray = require('./test_helper').makeCourseArray
let courses = null
const { initialStudents } = require('./test_helper')

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

  describe('When database has old courses with same names as the ones to be added', () => {
    beforeAll(async () => {
      await db.Course.destroy({
        where: {}
      })

      await db.Student.destroy({
        where: {}
      })
      
      await db.Application.destroy({
        where: {}
      })
      
      const oldCourses = [      
        {
          learningopportunity_id: 'TKT2352353',
          course_name: courses[0].course_name,
          year: courses[0].year - 1,
          period: courses[0].period
        },
        {
          learningopportunity_id: 'TKT2352353',
          course_name: courses[0].course_name,
          year: courses[0].year - 2,
          period: courses[0].period
        }
      ]


      const oldCoursesInDB = await Promise.all(oldCourses.map(n => db.Course.create(n)))
      const students = await Promise.all(initialStudents.map(n => db.Student.create(n)))
      students.forEach( student => 
        student.Application = {
          ...student.Application,
          accepted: true,
          groups: 2
        })
      await oldCoursesInDB[0].addStudents(students)
    })

    test('Groups are updated on new courses correctly', async () => { 
      const updatedCourses = await updateCourses()
      const courseWithOldImplementations = updatedCourses.filter( course => course.learningopportunity_id === courses[0].learningopportunity_id && course.course_name === courses[0].course_name)
      expect(courseWithOldImplementations[0].groups).toBe(6)
    })
  })
})