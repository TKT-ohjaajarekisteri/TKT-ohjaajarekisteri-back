'use strict'

//Sequelize model for Student database object
module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('Student', {
    student_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    student_number: {
      type: Sequelize.STRING(16),
      allowNull: false,
      unique: true
    },
    first_names: {
      type: Sequelize.STRING(127),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(127),
      allowNull: false
    },
    no_english: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    experience: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING(31),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(127),
      allowNull: true,
      validate: {
        isEmail: true
      }
    }
  })
  
  const StudentCourses = sequelize.define('student_course', {
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  //Association table config for Sequelize
  Student.associate = (models) => {
    Student.belongsToMany(models.Course, {
      through: StudentCourses,
      foreignKey: 'student_id',
      as: 'courses'
    })
  }

  return Student
}