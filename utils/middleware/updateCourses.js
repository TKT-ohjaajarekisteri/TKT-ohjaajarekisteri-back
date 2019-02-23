const axios = require('axios')
const db = require('../../models/index')
const config = require('../../config/config')

//Updates all courses
const updateCourses = async () => {
  const candidateDataJson = await axios.get(config.candidateCoursesUrl)
  const masterDataJson = await axios.get(config.masterCoursesUrl)
        
  const courses = Object.assign(candidateDataJson.data, masterDataJson.data)
    
  const addedCourses = []

  const currentCourses = await db.Course.findAll({ 
    raw:true,
    attributes: {
      exclude: ['course_id', 'createdAt', 'updatedAt']
    }
  })

  console.log('Updating courses...')
  for(let i = 0; i < courses.length; i++) {    
    for(let j = 0; j < courses[i].periods.length; j++) {
      const course = {
        learningopportunity_id: courses[i].learningopportunity_id,
        course_name: courses[i].realisation_name[0].text,
        period: courses[i].periods[j],
        year: parseInt(courses[i].start_date.substring(0,4))
      }
      if(!courseExistsInDB(currentCourses, course)) {
        addedCourses.push(course)     
      }
    }
  }
  await db.Course.bulkCreate(addedCourses)
  if(addedCourses.length > 0) console.log('Courses have been updated')
  else console.log('Database already up to date')
  return addedCourses
}

const courseExistsInDB = (currentCourses, course) => {
  for(let k = 0; k < currentCourses.length; k++) { 
    if(JSON.stringify(currentCourses[k]) === JSON.stringify(course)) {
      return true
    }
    delete currentCourses[k]
  }
  return false
}

module.exports = {
  updateCourses
}