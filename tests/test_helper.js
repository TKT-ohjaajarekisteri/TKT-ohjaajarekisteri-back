const db = require('../models/index')
const bcrypt = require('bcrypt')
const moment = require('moment')


const initialStudents = [
  {
    student_number: '123456789',
    first_names: 'Juhani',
    last_name: 'Pouta',
    phone: '0401234567',
    email: 'juhani.pouta@gmail.com',
  },
  {
    student_number: '987654321',
    first_names: 'Aarlo',
    last_name: 'Kustaa',
    phone: '0401234598',
    email: 'arska.kustaa@gmail.com',
  },
  {
    student_number: '192837465',
    first_names: 'Tomi',
    last_name: 'Virtanen',
    phone: '0405674567',
    email: 'tomi.virtanen@gmail.com',
  }
]

const passwordHasher = (password) => {
  const saltRounds = 10
  const passwordHash = bcrypt.hashSync(password, saltRounds)
  return passwordHash
}

const initialAdmins = [
  {
    username: 'testAdmin',
    passwordHash: passwordHasher('password')
  }
]

const initialCourses = [
  {
    learningopportunity_id: 'ohtu2018',
    course_name: 'Ohjelmistotuotanto 8',
    periods: [3],
    year: (parseInt(new Date().getFullYear()) + 1),
    startingDate: moment(new Date().getTime() - 100000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() + 2000000000).format('DD[.]MM[.]YYYY')
  },
  {
    learningopportunity_id: 'ohtu2017',
    course_name: 'Ohjelmistotuotanto 05',
    periods: [1],
    year: (parseInt(new Date().getFullYear()) + 1),
    startingDate: moment(new Date().getTime() - 100000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() + 2000000000).format('DD[.]MM[.]YYYY')
  },
  {
    learningopportunity_id: 'tira2018',
    course_name: 'Tietorakenteet ja algoritmit',
    periods: [2],
    year: (parseInt(new Date().getFullYear()) + 1),
    startingDate: moment(new Date().getTime() - 100000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() + 2000000000).format('DD[.]MM[.]YYYY')
  }
]
const initialPastCourses = [
  {
    learningopportunity_id: 'ohtu2018',
    course_name: 'Ohjelmistotuotanto 8',
    periods: [3],
    year: (parseInt(new Date().getFullYear())),
    startingDate: moment(new Date().getTime() - 100000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() + 2000000000).format('DD[.]MM[.]YYYY')
  },
  {
    learningopportunity_id: 'ohtu2017',
    course_name: 'Ohjelmistotuotanto 05',
    periods: [1],
    year: (parseInt(new Date().getFullYear())),
    startingDate: moment(new Date().getTime() - 100000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() + 2000000000).format('DD[.]MM[.]YYYY')
  },
  {
    learningopportunity_id: 'tira2018',
    course_name: 'Tietorakenteet ja algoritmit',
    periods: [2],
    year: (parseInt(new Date().getFullYear())),
    startingDate: moment(new Date().getTime() - 100000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() + 2000000000).format('DD[.]MM[.]YYYY')
  },
  {
    learningopportunity_id: 'jtkt018',
    course_name: 'Johdatus Tietojenkäsittelytieteisiin',
    periods: [4],
    year: (parseInt(new Date().getFullYear()) - 1),
    startingDate: moment(new Date().getTime() - 300000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() - 100000000).format('DD[.]MM[.]YYYY')
  },
  {
    learningopportunity_id: 'jtkt019',
    course_name: 'Johdatus tieteisiin',
    periods: [5],
    year: (parseInt(new Date().getFullYear())),
    startingDate: moment(new Date().getTime() - 300000000).format('DD[.]MM[.]YYYY'),
    endingDate: moment(new Date().getTime() + 600000000).format('DD[.]MM[.]YYYY')
  }

]

const studentsInDb = async () => {
  const students = await db.Student.findAll({})
  return students
}

const coursesInDb = async () => {
  const courses = await db.Course.findAll({})
  return courses
}

const usersInDb = async () => {
  const users = await db.User.findAll({})
  return users
}

const adminsInDb = async () => {
  const admins = await db.Admin.findAll({})
  return admins
}

const deleteUser = async (student_number) => {
  const foundStudent = await db.Student.findOne({ where: { student_number: student_number } })
  const foundUser = await db.User.findOne({ where: { role_id: foundStudent.student_id } })
  await db.Student.destroy({ where: { student_id: foundStudent.student_id } })
  await db.User.destroy({ where: { user_id: foundUser.user_id } })
}

const makeCourseArray = (array) => {
  const courses = []
  for(let i = 0; i < array.length; i++) {    
    const course = {
      learningopportunity_id: array[i].learningopportunity_id,
      course_name: array[i].realisation_name[0].text,
      periods: array[i].periods,
      year: parseInt(array[i].start_date.substring(0,4)),
      startingDate: moment(array[i].start_date).format('DD[.]MM[.]YYYY'),
      endingDate: moment(array[i].end_date).format('DD[.]MM[.]YYYY'),
    }
    const courseIdentifier = course.learningopportunity_id.substring(0,3)
    if(array[i].realisation_type_code !== 8) {
      if(courseIdentifier === 'CSM' || courseIdentifier === 'TKT' || courseIdentifier === 'DAT') {
        courses.push(course)
      }
    }
  }
  return courses
}

module.exports = {
  initialStudents,
  initialCourses,
  initialPastCourses,
  initialAdmins,
  studentsInDb,
  coursesInDb,
  usersInDb,
  adminsInDb,
  deleteUser,
  makeCourseArray,
  passwordHasher
}
