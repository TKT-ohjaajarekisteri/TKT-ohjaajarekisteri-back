'use strict'
module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('student', {
    student_id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  })

  Student.associate = (models) => {
    Student.hasMany(models.Course, {
      through: 'student_course',
      foreignKey: 'course_id',
      as: 'Courses'
    })
  }

  return Student
}