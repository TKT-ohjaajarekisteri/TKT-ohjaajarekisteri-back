'use strict'
module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define('Course', {
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
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })

  Course.associate = (models) => {
    Course.belongsToMany(models.Student, {
      through: 'student_course',
      foreignKey: 'course_id',
      as: 'students'
    })
  }

  return Course
}