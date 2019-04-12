if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgresql',
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 300000000
    }
  },
  development: {
    url: process.env.DEV_DATABASE_URL,
    port: process.env.DEV_PORT,
    dialect: 'postgresql',
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 300000000
    }
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    port: process.env.TEST_PORT,
    logging: false,
    dialect: 'postgresql',
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 300000000
    }
  },
  travis: {
    url: 'postgres://postgres@127.0.0.1:5432/travis_ci_test',
    logging: false,
    dialect: 'postgresql',
    'ssl': true,
    'dialectOptions': {
      'ssl': true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 300000000
    }
  }
}