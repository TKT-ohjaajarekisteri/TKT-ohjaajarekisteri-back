module.exports = (sequelize, Sequelize) => {
  const StudentCourse = sequelize.define('student_course', {
    groups: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  return StudentCourse
}