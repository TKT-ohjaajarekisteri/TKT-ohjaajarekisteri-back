'use strict'

//Sequelize model for Study program url database object
module.exports = (sequelize, Sequelize) => {
  const StudyProgramUrl = sequelize.define('StudyProgramUrl', {
    studyProgramUrl_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    type: {
      type: Sequelize.STRING(31),
      allowNull: false,
      unique: true
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  })

  return StudyProgramUrl
}