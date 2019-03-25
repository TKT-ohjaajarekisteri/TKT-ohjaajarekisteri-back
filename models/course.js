'use strict'

//Sequelize model for Student database object
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
      type: Sequelize.STRING(255),
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

  const StudentCourses = sequelize.define('student_course', {
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  //Association table config for Sequelize
  Course.associate = (models) => {
    Course.belongsToMany(models.Student, {
      through: StudentCourses,
      foreignKey: 'course_id',
      as: 'students'
    })
  }

  return Course
}