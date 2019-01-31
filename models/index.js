
'use strict'

var fs        = require('fs')
var path      = require('path')
var Sequelize = require('sequelize')
const config = require('../utils/config')
const db = {}

const sequelize = new Sequelize(config.databaseUrl, {
  host: 'db',
  port: config.port,
  dialect: 'postgres',
  'ssl': true,
  'dialectOptions': {
    'ssl': true
  },
  //Shows SQL queries from Sequelize
  logging: false,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 300000000
  }
})

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.connect = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

  } catch(exception) {
    console.error('Unable to connect to the database:', exception)
  }
  await sequelize.sync()
  //await sequelize.sync({ force:true })
  console.log('Tables have been created')
}

module.exports = db
