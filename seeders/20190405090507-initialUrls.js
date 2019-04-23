/* eslint-disable no-unused-vars */
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('StudyProgramUrls', [{
      type: 'candidate',
      url: 'https://opetushallinto.cs.helsinki.fi/organizations/500-K005/filtered_courses.json',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'master',
      url: 'https://opetushallinto.cs.helsinki.fi/organizations/500-M009/filtered_courses.json',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'data',
      url: 'https://opetushallinto.cs.helsinki.fi/organizations/500-M010/filtered_courses.json',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('StudyProgramUrls', null, {})
  }
}
