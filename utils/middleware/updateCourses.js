const axios = require('axios')
const db = require('../../models/index')
const sort = require('fast-sort')

//Updates all courses
const updateCourses = async () => {

  const candidateCoursesUrl = await db.StudyProgramUrl.findOne({ where: { type: 'candidate' } })
  const masterCoursesUrl = await db.StudyProgramUrl.findOne({ where: { type: 'master' } })
  const dataScienceCoursesUrl = await db.StudyProgramUrl.findOne({ where: { type: 'data' } })

  const candidateDataJson = await axios.get(candidateCoursesUrl.url)
  const masterDataJson = await axios.get(masterCoursesUrl.url) 
  const dataScienceDataJson = await axios.get(dataScienceCoursesUrl.url)

  const candidataCourses = Object.assign(candidateDataJson.data)
  const masterCourses = Object.assign(masterDataJson.data)
  const dataScienceCourses = Object.assign(dataScienceDataJson.data)

  const addedCourses = []

  const currentCourses = await db.Course.findAll({ 
    raw:true,
    attributes: {
      exclude: ['course_id', 'createdAt', 'updatedAt', 'groups', 'hidden']
    }
  })

  const coursesAtStart = await db.Course.findAll({ 
    include: 
      [{
        model: db.Student,
        as: 'students'
      }]
  })

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    console.log('Updating courses...')
  }
  await addCoursesToDatabase(candidataCourses, addedCourses, currentCourses, coursesAtStart)
  await addCoursesToDatabase(masterCourses, addedCourses, currentCourses, coursesAtStart)
  await addCoursesToDatabase(dataScienceCourses, addedCourses, currentCourses, coursesAtStart)

  sort(addedCourses).asc([
    'learningopportunity_id', // Sort by ID
    'period', // courses with the same ID are sorted by period
  ])

  await db.Course.bulkCreate(addedCourses)
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    if(addedCourses.length > 0) console.log('Courses have been updated')
    else console.log('Database already up to date')
  }
  return addedCourses
}

//Adds the courses from an array to the database
const addCoursesToDatabase = async (courses, addedCourses, currentCourses, coursesAtStart) => {
  for(let i = 0; i < courses.length; i++) {    
    for(let j = 0; j < courses[i].periods.length; j++) {
      const course = {
        learningopportunity_id: courses[i].learningopportunity_id,
        course_name: courses[i].realisation_name[0].text,
        period: courses[i].periods[j],
        year: parseInt(courses[i].start_date.substring(0,4))
      }
      const courseIdentifier = course.learningopportunity_id.substring(0,3)
      if(courseIdentifier === 'CSM' || courseIdentifier === 'TKT' || courseIdentifier === 'DAT') {
        if(!courseExists(currentCourses, course)) {
          currentCourses.push(course) 
          course.groups = await getMostRecentGroupSize(course.course_name, coursesAtStart)
          addedCourses.push(course)      
        }
      }
    }
  }
}

//Checks if the course exists in database or has been added recently
const courseExists = (currentCourses, course) => {
  for(let k = 0; k < currentCourses.length; k++) { 
    if(JSON.stringify(currentCourses[k]) === JSON.stringify(course)) {
      return true
    }
  }
  return false
}

//Returns the group size of all applicants groups combined for the previous implementation of the course 
const getMostRecentGroupSize = async (newCourseName, coursesAtStart) => {

  //Get all courses with the same name as the course to be added
  const sameNameCourses = coursesAtStart.filter(courseAtStart => newCourseName  === courseAtStart.course_name)
  if(sameNameCourses.length === 0) return null

  //Get course with the highest year and period IE the most recent course in DB
  const years = sameNameCourses.map(course => course.year)
  const previousYear = Math.max( ...years)
  const previousYearsCourses = sameNameCourses.filter(course => course.year === previousYear)
  const periods = previousYearsCourses.map(course => course.period)
  const previousPeriod = Math.max( ...periods)

  //Get the most recent course from courses in database
  const previousCourse = coursesAtStart.find(oldCourse => 
    oldCourse.course_name === newCourseName && oldCourse.period === previousPeriod && oldCourse.year === previousYear)
  if(!previousCourse.students) return null

  //Get the groups of all applications as an array of groups
  const groups = []

  previousCourse.students.forEach( student => {
    if(student.Application.accepted) {
      groups.push(student.Application.groups)
    }
  })
  //Sum up all of the groups on the course
  const sum = groups.reduce((partial_sum, a) => partial_sum + a)
  return sum
}

module.exports = {
  updateCourses
}