/* eslint-disable no-unused-vars */
'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [{
      username: 'testAdmin',
      password: 'pass',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {})
  }
}
