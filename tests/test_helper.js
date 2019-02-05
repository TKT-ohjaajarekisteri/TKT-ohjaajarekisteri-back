const db = require('../models/index')
const initialStudents = [
  {
    student_number: 'a1504546',
    first_name: 'Juhani',
    last_name: 'Pouta',
    nickname: 'Juhani',
    phone: '0401234567',
    email: 'juhani.pouta@gmail.com',
  },
  {
    student_number: 'a1504512',
    first_name: 'Aarlo',
    last_name: 'Kustaa',
    nickname: 'Arska',
    phone: '0401234598',
    email: 'arska.kustaa@gmail.com',
  },
  {
    student_number: 'a1504502',
    first_name: 'Tomi',
    last_name: 'Virtanen',
    nickname: 'Tomppa',
    phone: '0405674567',
    email: 'tomi.virtanen@gmail.com',
  }
]

const initialUsers = [
  {
    role: 'admin',
    role_id: 1 
  },
  {
    role: 'student',
    role_id: 1 
  },
  {
    role: 'student',
    role_id: 2
  },
  {
    role: 'student',
    role_id: 3
  }
]

const initialAdmins = [
  {
    username: "testAdmin",
    password: "right"
  }
]

const initialCourses = [
  {
    learningopportunity_id: 'ohtu2018',
    course_name: 'Ohjelmistotuotanto 8',
    period: 3,
    year: 2018
  },
  {
    learningopportunity_id: 'ohtu2017',
    course_name: 'Ohjelmistotuotanto 05',
    period: 1,
    year: 2015
  },
  {
    learningopportunity_id: 'tira2018',
    course_name: 'Tietorakenteet ja algoritmit',
    period: 2,
    year: 2018
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

module.exports = {
  initialStudents,
  initialCourses,
  studentsInDb,
  initialUsers,
  coursesInDb,
  usersInDb
}
