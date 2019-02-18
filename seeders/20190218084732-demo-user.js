/* eslint-disable no-unused-vars */
'use strict'


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const admin = await queryInterface.sequelize.query(
      'SELECT * FROM "Admins" WHERE username = ? ', {
        replacements: ['testAdmin'],
        type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    return queryInterface.bulkInsert('Users', [{
      role: 'admin',
      role_id: admin[0].admin_id,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
