'use strict'
module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define('course', {
    course_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    learningopportunity_id: {
      type: Sequelize.STRING(31),
      allowNull: false
    },
    course_name: {
      type: Sequelize.STRING(63),
      allowNull: false
    },
    period: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER
    }
  })

  Course.associate = (models) => {
    Course.belongsToMany(models.Student, {
      through: 'student_course',
      foreignKey: 'student_id',
      as: 'Students'
    })
  }

  return Course
}