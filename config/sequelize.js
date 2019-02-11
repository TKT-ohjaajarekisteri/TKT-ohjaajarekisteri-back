require('dotenv').config()

module.exports = {
    production: {
        url: process.env.DATABASE_URL,
        port: process.env.PORT,
        dialect: "postgresql",
        "ssl": true,
        "dialectOptions": {
            "ssl": true
        },
        operatorsAliases: false,
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
        dialect: "postgresql",
        "ssl": true,
        "dialectOptions": {
            "ssl": true
        },
        operatorsAliases: false,
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
        dialect: "postgresql",
        "ssl": true,
        "dialectOptions": {
            "ssl": true
        },
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 10000,
          idle: 300000000
        }
    }
}