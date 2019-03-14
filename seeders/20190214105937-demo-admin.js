/* eslint-disable no-unused-vars */
'use strict'
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash('pass', saltRounds)

    return queryInterface.bulkInsert('Admins', [{
      username: 'testAdmin',
      passwordHash: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {})
  }
}
