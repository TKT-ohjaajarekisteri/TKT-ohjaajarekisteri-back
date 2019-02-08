const db = require('../models/index')
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

const initialAdmins = [
  {
    username: 'testAdmin',
    password: 'password'
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

module.exports = {
  initialStudents,
  initialCourses,
  initialAdmins,
  studentsInDb,
  coursesInDb,
  usersInDb,
  adminsInDb,
  deleteUser
}
