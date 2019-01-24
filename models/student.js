'use strict'
module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('student', {
    student_id: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: Sequelize.STRING(127),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(127),
      allowNull: false
    },
    nickname: {
      type: Sequelize.STRING(63),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(31),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(127),
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