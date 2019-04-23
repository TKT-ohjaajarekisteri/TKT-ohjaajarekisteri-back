
var fs        = require('fs')
var path      = require('path')
var Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

//Initialize Sequelize
const sequelize = new Sequelize(config.sequelizeConfig.url, config.sequelizeConfig)

//Assigns model names to db based on file names
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

//Associates all models of db
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

//Checks database connection and creates tables if they don't exist
db.connect = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

  } catch(exception) {
    console.error('Unable to connect to the database:', exception)
  }
  await sequelize.sync()
  console.log('Tables have been created')
}

module.exports = db
