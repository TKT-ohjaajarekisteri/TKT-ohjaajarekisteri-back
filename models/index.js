const Sequelize = require('sequelize')
const config = require('../utils/config')
const StudentModel = require('./student')
const CourseModel = require('./course')
const db = {}

const sequelize = new Sequelize(config.databaseUrl, {
  host: 'db',
  port: config.port,
  dialect: 'postgres',
  'ssl': true,
  'dialectOptions': {
    'ssl': true
  },
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 300000000
  }
})

db.Student = StudentModel(sequelize, Sequelize)
db.Course = CourseModel(sequelize, Sequelize)

db.Student.associate(db)
db.Course.associate(db)

db.sequelize = sequelize
db.Sequelize = Sequelize

db.connect = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

  } catch(exception) {
    console.error('Unable to connect to the database:', exception)
  }
  if (process.env.NODE_ENV !== 'test') {
    await sequelize.sync()
  }
}

db.close = async () => {
  try {
    await sequelize.close()
    console.log('client has disconnected')

  } catch(exception) {
    console.log('error during disconnection', exception)
  }
}

module.exports = db
