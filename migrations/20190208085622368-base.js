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
  'name': '20190208085622368-base',
  'created': '2019-02-08T08:56:22.368Z',
  'comment': ''
}
//Commands that are run upon migration
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
      'passwordHash': {
        'type': Sequelize.STRING,
        'field': 'passwordHash',
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
        'type': Sequelize.STRING(255),
        'field': 'course_name',
        'allowNull': false
      },
      'periods': {
        'type': Sequelize.ARRAY(Sequelize.INTEGER),
        'field': 'periods',
        'allowNull': false
      },
      'year': {
        'type': Sequelize.INTEGER,
        'field': 'year',
        'allowNull': false
      },
      'startingDate': {
        'type': Sequelize.STRING(30),
        'field': 'startingDate',
        'allowNull': false
      },
      'endingDate': {
        'type': Sequelize.STRING(30),
        'field': 'endingDate',
        'allowNull': false
      },
      'groups': {
        'type': Sequelize.INTEGER,
        'field': 'groups'
      },
      'hidden': {
        'type': Sequelize.BOOLEAN,
        'field': 'hidden',
        'defaultValue': false
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
      'first_names': {
        'type': Sequelize.STRING(127),
        'field': 'first_names',
        'allowNull': false
      },
      'last_name': {
        'type': Sequelize.STRING(127),
        'field': 'last_name',
        'allowNull': false
      },
      'no_english': {
        'type': Sequelize.BOOLEAN,
        'defaultValue': false
      },
      'experience': {
        'type': Sequelize.STRING(1000),
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
      'apprentice': {
        'type': Sequelize.BOOLEAN,
        'defaultValue': false
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
    'StudyProgramUrls',
    {
      'studyProgramUrl_id': {
        'type': Sequelize.INTEGER,
        'field': 'studyProgramUrl_id',
        'unique': true,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true
      },
      'type': {
        'type': Sequelize.STRING(31),
        'field': 'type',
        'allowNull': false,
        'unique': true
      },
      'url': {
        'type': Sequelize.STRING(255),
        'field': 'url',
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
    'Applications',
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
      'application_id': {
        'type': Sequelize.INTEGER,
        'field': 'application_id',
        'unique': true,
        'allowNull': false,
        'primaryKey': true,
        'autoIncrement': true
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
        'foreignKey': true
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
        'foreignKey': true
      },
      'groups': {
        'type': Sequelize.INTEGER,
        'field': 'groups',
        'defaultValue': 0
      },
      'accepted': {
        'type': Sequelize.BOOLEAN,
        'field': 'accepted',
        'defaultValue': true
      },
      'hidden': {
        'type': Sequelize.BOOLEAN,
        'field': 'hidden',
        'defaultValue': true
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
