/* eslint-disable no-unused-vars */
'use strict'
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // const saltRounds = 10
    // const passwordHash = await bcrypt.hash('', saltRounds)
    const passwordHash = '$2b$10$gEd.2O9QFTIhVRFGhXVo4eKky5UudY2a7CtyCxBAM0YlALBv4saKq'

    return queryInterface.bulkInsert('Admins', [{
      username: 'rekAdmin',
      passwordHash: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {})
  }
}
