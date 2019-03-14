'use strict'

//Sequelize model for Admin database object
module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define('Admin', {
    admin_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    username: {
      type: Sequelize.STRING(55),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

  return Admin
}