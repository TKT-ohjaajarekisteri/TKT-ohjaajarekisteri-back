module.exports = (sequelize, Sequelize) => {
  const StudentCourse = sequelize.define('student_course', {
    groups: {
      type: Sequelize.INTEGER
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  return StudentCourse
}