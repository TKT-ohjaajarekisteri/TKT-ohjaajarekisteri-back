const axios = require('axios')
const db = require('../../models/index')
const config = require('../../config/config')

//Updates all courses
const updateCourses = async () => {
  const candidateDataJson = await axios.get(config.candidateCoursesUrl)
  const masterDataJson = await axios.get(config.masterCoursesUrl)
        
  const courses = Object.assign(candidateDataJson.data, masterDataJson.data)
    
  const addedCourses = []

  console.log('Updating courses...')
  for(let i = 0; i < courses.length; i++) {
    const course = courses[i]
    const foundCourse = await db.Course.findOne({
      where: {
        learningopportunity_id: course.learningopportunity_id,
        course_name: course.realisation_name[0].text,
        periods: course.periods,
        year: course.start_date.substring(0,4)
      }
    })
    
    if(!foundCourse) {
      const addedCourse = await db.Course.create({
        learningopportunity_id: course.learningopportunity_id,
        course_name: course.realisation_name[0].text,
        periods: course.periods,
        year: course.start_date.substring(0,4)
      })
      addedCourses.push(addedCourse)
    }
  }
  return addedCourses
}

module.exports = {
  updateCourses
}