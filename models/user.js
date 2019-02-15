'use strict'

//Sequelize model for User database object
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    role: {
      type: Sequelize.STRING(16),
      allowNull: false
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })

  return User
}