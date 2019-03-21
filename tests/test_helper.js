const db = require('../models/index')
const bcrypt = require('bcrypt')

const initialStudents = [
  {
    student_number: '123456789',
    first_names: 'Juhani',
    last_name: 'Pouta',
    nickname: 'Juhani',
    phone: '0401234567',
    email: 'juhani.pouta@gmail.com',
  },
  {
    student_number: '987654321',
    first_names: 'Aarlo',
    last_name: 'Kustaa',
    nickname: 'Arska',
    phone: '0401234598',
    email: 'arska.kustaa@gmail.com',
  },
  {
    student_number: '192837465',
    first_names: 'Tomi',
    last_name: 'Virtanen',
    nickname: 'Tomppa',
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
    period: 3,
    year: (parseInt(new Date().getFullYear()) + 1)
  },
  {
    learningopportunity_id: 'ohtu2017',
    course_name: 'Ohjelmistotuotanto 05',
    period: 1,
    year: (parseInt(new Date().getFullYear()) + 1)
  },
  {
    learningopportunity_id: 'tira2018',
    course_name: 'Tietorakenteet ja algoritmit',
    period: 2,
    year: (parseInt(new Date().getFullYear()) + 1)
  }

]

const initialPastCourses = [
  {
    learningopportunity_id: 'ohtu2018',
    course_name: 'Ohjelmistotuotanto 8',
    period: 3,
    year: (parseInt(new Date().getFullYear()) + 1)
  },
  {
    learningopportunity_id: 'ohtu2017',
    course_name: 'Ohjelmistotuotanto 05',
    period: 1,
    year: (parseInt(new Date().getFullYear()) + 1)
  },
  {
    learningopportunity_id: 'tira2018',
    course_name: 'Tietorakenteet ja algoritmit',
    period: 2,
    year: (parseInt(new Date().getFullYear()) + 1)
  },
  {
    learningopportunity_id: 'jtkt018',
    course_name: 'Johdatus Tietojenkäsittelytieteisiin',
    period: 4,
    year: (parseInt(new Date().getFullYear()) - 1)
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
    for(let j = 0; j < array[i].periods.length; j++) {
      const course = {
        learningopportunity_id: array[i].learningopportunity_id,
        course_name: array[i].realisation_name[0].text,
        period: array[i].periods[j],
        year: parseInt(array[i].start_date.substring(0,4))
      }
      const courseIdentifier = course.learningopportunity_id.substring(0,3)
      const courseName = course.course_name
      if(!(courseName.includes('(U)') || courseName.includes('(HT)') || courseName.includes('(HT/U)'))) {
        if(courseIdentifier === 'CSM' || courseIdentifier === 'TKT' || courseIdentifier === 'DAT') {
          courses.push(course)
        }
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
