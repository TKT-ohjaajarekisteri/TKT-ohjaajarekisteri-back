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

let Student
let Course

db.connect = () => {
  setTimeout(function () {
    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err)
      })

    db.Student = StudentModel(sequelize, Sequelize)
    db.Course = CourseModel(sequelize, Sequelize)

    db.Student.associate(db)
    db.Course.associate(db)

    db.Sequelize = Sequelize
    sequelize.sync()
  }, 9000)
}

db.close = () => {
  sequelize.close()
    .then(() => console.log('client has disconnected'))
    .catch(err => console.log('error during disconnection', err.stack))
}

module.exports = db