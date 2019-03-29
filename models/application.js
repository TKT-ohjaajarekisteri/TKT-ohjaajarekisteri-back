module.exports = (sequelize, Sequelize) => {
  const Application = sequelize.define('Application', {
    groups: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })

  return Application
}