module.exports = (sequelize, Sequelize) => {

  //Sequelize model for students application database object
  const Application = sequelize.define('Application', {
    groups: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    hidden: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  return Application
}