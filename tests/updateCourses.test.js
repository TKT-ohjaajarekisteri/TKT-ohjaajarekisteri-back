const db = require('../models/index')
const axios = require('axios')
const sort = require('fast-sort')
const updateCourses = require('../utils/middleware/updateCourses').updateCourses
const makeCourseArray = require('./test_helper').makeCourseArray
let courses = null
const { initialStudents } = require('./test_helper')

describe('tests for updating courses', () => {
  jest.setTimeout(15000)

  describe('When database has study program urls', () => {
    beforeEach(async () => {
      await db.StudyProgramUrl.destroy({
        where: {}
      })

      await db.Course.destroy({
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
      expect(JSON.stringify(courses)).toContain(JSON.stringify(updatedCourses[0].learningopportunity_id))
      expect(JSON.stringify(courses)).toContain(JSON.stringify(updatedCourses[1].learningopportunity_id))
      expect(JSON.stringify(courses)).toContain(JSON.stringify(updatedCourses[updatedCourses.length-1].learningopportunity_id))

    })

    test('No new courses are added, when updated twice in a row', async () => { 
      await updateCourses()
      const updatedCourses = await updateCourses()
      expect(updatedCourses.length).toEqual(0)
    })

  })

  describe('When database has old courses with same names as the ones to be added', () => {
    beforeEach(async () => {
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
          periods: courses[0].periods,
          startingDate: '20.07.2018',
          endingDate: '07.11.2018'
        },
        {
          learningopportunity_id: 'TKT2352353',
          course_name: courses[0].course_name,
          year: courses[0].year - 2,
          periods: courses[0].periods,
          startingDate: '03.04.2018',
          endingDate: '03.05.2018'
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

      students[0].Application.accepted = false  
      await oldCoursesInDB[0].addStudents(students)
    })

    test('Groups are updated on new courses correctly', async () => { 
      const updatedCourses = await updateCourses()
      const courseWithOldImplementations = updatedCourses.filter( course => course.learningopportunity_id === courses[0].learningopportunity_id && course.course_name === courses[0].course_name)
      expect(courseWithOldImplementations[0].groups).toBe(4)
    })
  })
})