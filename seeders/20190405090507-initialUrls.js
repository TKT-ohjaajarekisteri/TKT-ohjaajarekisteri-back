/* eslint-disable no-unused-vars */
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('StudyProgramUrls', [{
      type: 'candidate',
      url: 'https://studies.helsinki.fi/organizations/500-K005/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'master',
      url: 'https://studies.helsinki.fi/organizations/500-M009/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'data',
      url: 'https://studies.helsinki.fi/organizations/500-M010/courses_list.json?periods=1&periods=2&periods=3&periods=4&periods=5&types=teaching',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StudyProgramUrls', null, {})
  }
}
