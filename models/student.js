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
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }   
  })

  Student.associate = (models) => {
    Student.hasMany(models.Course, {
      foreignKey: 'course_id',
      as: 'Courses'
    })
  }

  return Student
}