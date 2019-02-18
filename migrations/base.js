/* eslint-disable no-unused-vars */
'use strict'

var Sequelize = require('sequelize')

/**
 * Actions summary:
 * up:
 * createTable 'Admins', deps: []
 * createTable 'Courses', deps: []
 * createTable 'Students', deps: []
 * createTable 'Users', deps: []
 * createTable 'student_course', deps: [Courses, Students]
 *
 * down:
 * drop all tables
 **/

var info = {
  'revision': 1,
  'name': 'base',
  'created': '2019-02-08T08:56:22.368Z',
  'comment': ''
}

var migrationCommands = [{
  fn: 'createTable',
  params: [
    'Admins',
    {
      'admin_id': {
        'type': Sequelize.INTEGER,
        'field': 'admin_id',
        'unique': true,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true
      },
      'username': {
        'type': Sequelize.STRING(55),
        'field': 'username',
        'unique': true,
        'allowNull': false
      },
      'password': {
        'type': Sequelize.STRING(55),
        'field': 'password',
        'allowNull': false
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      }
    },
    {}
  ]
},
{
  fn: 'createTable',
  params: [
    'Courses',
    {
      'course_id': {
        'type': Sequelize.INTEGER,
        'field': 'course_id',
        'unique': true,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true
      },
      'learningopportunity_id': {
        'type': Sequelize.STRING(31),
        'field': 'learningopportunity_id',
        'allowNull': false
      },
      'course_name': {
        'type': Sequelize.STRING(63),
        'field': 'course_name',
        'allowNull': false
      },
      'period': {
        'type': Sequelize.INTEGER,
        'field': 'period',
        'allowNull': false
      },
      'year': {
        'type': Sequelize.INTEGER,
        'field': 'year',
        'allowNull': false
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      }
    },
    {}
  ]
},
{
  fn: 'createTable',
  params: [
    'Students',
    {
      'student_id': {
        'type': Sequelize.INTEGER,
        'field': 'student_id',
        'unique': true,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true
      },
      'student_number': {
        'type': Sequelize.STRING(16),
        'field': 'student_number',
        'unique': true,
        'allowNull': false
      },
      'first_name': {
        'type': Sequelize.STRING(127),
        'field': 'first_name',
        'allowNull': false
      },
      'last_name': {
        'type': Sequelize.STRING(127),
        'field': 'last_name',
        'allowNull': false
      },
      'nickname': {
        'type': Sequelize.STRING(63),
        'field': 'nickname',
        'allowNull': true
      },
      'phone': {
        'type': Sequelize.STRING(31),
        'field': 'phone',
        'allowNull': true
      },
      'email': {
        'type': Sequelize.STRING(127),
        'field': 'email',
        'validate': {
          'isEmail': true
        },
        'allowNull': true
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      }
    },
    {}
  ]
},
{
  fn: 'createTable',
  params: [
    'Users',
    {
      'user_id': {
        'type': Sequelize.INTEGER,
        'field': 'user_id',
        'unique': true,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true
      },
      'role': {
        'type': Sequelize.STRING(16),
        'field': 'role',
        'allowNull': false
      },
      'role_id': {
        'type': Sequelize.INTEGER,
        'field': 'role_id',
        'allowNull': false
      },
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      }
    },
    {}
  ]
},
{
  fn: 'createTable',
  params: [
    'student_course',
    {
      'createdAt': {
        'type': Sequelize.DATE,
        'field': 'createdAt',
        'allowNull': false
      },
      'updatedAt': {
        'type': Sequelize.DATE,
        'field': 'updatedAt',
        'allowNull': false
      },
      'course_id': {
        'type': Sequelize.INTEGER,
        'field': 'course_id',
        'onUpdate': 'CASCADE',
        'onDelete': 'CASCADE',
        'references': {
          'model': 'Courses',
          'key': 'course_id'
        },
        'primaryKey': true
      },
      'student_id': {
        'type': Sequelize.INTEGER,
        'field': 'student_id',
        'onUpdate': 'CASCADE',
        'onDelete': 'CASCADE',
        'references': {
          'model': 'Students',
          'key': 'student_id'
        },
        'primaryKey': true
      }
    },
    {}
  ]
}
]

module.exports = {
  pos: 0,
  /**
     * Creates all tables and relational tables listed in migrationCommands array
     * @param {*} queryInterface Sequelize interface for handier queries.
     * @param {*} Sequelize 
     */
  up: function(queryInterface, Sequelize) {
    var index = this.pos
    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index]
          console.log('[#'+index+'] execute: ' + command.fn)
          index++
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject)
        }
        else
          resolve()
      }
      next()
    })
  },
  /**
     * Drops all tables except SequelizeMeta, which keeps track of migration history.
     * @param {*} queryInterface Sequelize interface for handier queries.
     * @param {*} Sequelize 
     */
  down: function(queryInterface, Sequelize) {
    return  new Promise(function(resolve, reject){
      queryInterface.dropAllTables({ skip: 'SequelizeMeta' })
        .then(resolve).catch(reject)
    })
  },
  info: info
}
