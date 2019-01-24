const Student = require('../models/student')
const Course = require('../models/course')

const initialStudents = [
    {
      student_id: "5a422a851b54a676234d17f7",
      first_name: "Juhani",
      last_name: "Pouta",
      nickname: "Juhani",
      phone: "0401234567",
      email: "juhani.pouta@gmail.com"
    },
    {
      student_id: "5a422a851b54a676234d17f8",
      first_name: "Aarlo",
      last_name: "Kustaa",
      nickname: "Arska",
      phone: "0401234598",
      email: "arska.kustaa@gmail.com"
    },
    {
      student_id: "5a422a851b54a676234d17f9",
      first_name: "Tomi",
      last_name: "Virtanen",
      nickname: "Tomppa",
      phone: "0405674567",
      email: "tomi.virtanen@gmail.com"
    }
  ]

  const initialCourses = [
    {
      course_id: "a5f63g",
      learningopportunity_id: "ohtu2018",
      course_name: "Ohjelmistotuotanto",
      period: 3,
      year: 2018
    },
    {
      course_id: "a5f639",
      learningopportunity_id: "ohtu2017",
      course_name: "Ohjelmistotuotanto",
      period: 3,
      year: 2017
    },
    {
      course_id: "a5f632",
      learningopportunity_id: "tira2018",
      course_name: "Tietorakenteet ja algoritmit",
      period: 2,
      year: 2018
    }
  ]


const studentsInDb = async () => {
  const students = await student.find({})
  return students.map(student.format)
}

const coursesInDb = async () => {
  const courses = await course.find({})
  return courses.map(course.format)
}

module.exports = {
  initialStudents, initialCourses, studentsInDb, coursesInDb
}
