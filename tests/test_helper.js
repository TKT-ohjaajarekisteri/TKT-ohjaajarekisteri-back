const db = require('../models/index')
const initialStudents = [
  {
    student_id: 'a1504546',
    first_name: 'Juhani',
    last_name: 'Pouta',
    nickname: 'Juhani',
    phone: '0401234567',
    email: 'juhani.pouta@gmail.com',
  },
  {
    student_id: 'a1504512',
    first_name: 'Aarlo',
    last_name: 'Kustaa',
    nickname: 'Arska',
    phone: '0401234598',
    email: 'arska.kustaa@gmail.com',
  },
  {
    student_id: 'a1504502',
    first_name: 'Tomi',
    last_name: 'Virtanen',
    nickname: 'Tomppa',
    phone: '0405674567',
    email: 'tomi.virtanen@gmail.com',
  }
]

const initialCourses = [
  {
    course_id: 'a5f63g',
    learningopportunity_id: 'ohtu2018',
    course_name: 'Ohjelmistotuotanto',
    period: 3,
    year: 2018
  },
  {
    course_id: 'a5f639',
    learningopportunity_id: 'ohtu2017',
    course_name: 'Ohjelmistotuotanto',
    period: 3,
    year: 2017
  },
  {
    course_id: 'a5f632',
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

module.exports = {
  initialStudents, initialCourses, studentsInDb, coursesInDb
}
