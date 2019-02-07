const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const axios = require('axios')
const db = require('../models/index')

// Check for usre credentials on 'http://opetushallinto.cs.helsinki.fi/login'
// {
//   "username": "",
//   "student_number": "",
//   "first_names": "",
//   "last_name": ""
// }


const authenticateOpetushallinto = async (username, password) => {
  try {
    const response = await axios.post(config.login,
      {
        'username': username,
        'password': password
      }
    )
    return response

  } catch (error) {
    throw error
  }
}

// Function for testing
const authenticateFake = async (username, password) => {
  return { // manual test data
    student_number: "123456789",
    first_name: "test",
    last_name: "testersson"
  }
}

const authenticate = async (username, password) => {
  return await authenticateOpetushallinto(username, password)
  // return await authenticateFake(username, password)
}


// Route for handling login
loginRouter.post('/', async (request, response) => {
  try {
    if (!request.body.username || !request.body.password) {
      // username or password field undefined
      return response.status(400).json({ error: 'missing username or password' })
    }

    // authenticate user
    let authResponse
    try {
      authResponse = await authenticate(request.body.username, request.body.password)
    } catch (error) {
      //error from auth server
      console.log(error)
      return response.status(500).json({ error: 'authentication error' })
    }
    const authenticatedUser = authResponse.data

    console.log('auth USER: ', authenticatedUser)

    if (!authenticatedUser.hasOwnProperty('student_number')) {
      await loginAdmin(request, response)
    } else {
      await loginStudent(request, response, authenticatedUser)
    }
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error: 'authentication error' })
  }
})


const loginAdmin = async (request, response) => {
  try {
    // find admin and user info
    console.log('loggin admin')
    const foundAdmin = await db.Admin.findOne({ where: { username: request.body.username } })
    if (!foundAdmin) {
      // incorrect credentials from auth server
      return response.status(401).json({ error: 'incorrect credentials' })
    }
    const foundUser = await db.User.findOne({ where: { role_id: foundAdmin.admin_id, role: 'admin' } })
    // jwt sign for admin
    const token = jwt.sign({ id: foundUser.user_id, role: foundUser.role }, config.secret)
    return response.status(200).json({
      token,
      user: {
        user_id: foundAdmin.admin_id,
        role: 'admin'
      }
    })
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error: 'authentication error' })
  }
}

const loginStudent = async (request, response, authenticatedUser) => {
  try {
    // find student and user info
    console.log('loggin student')
    const foundStudent = await db.Student.findOne({ where: { student_number: authenticatedUser.student_number } })
    if (foundStudent) {
      // user already in database, no need to add
      const foundUser = await db.User.findOne({ where: { role_id: foundStudent.student_id, role: 'student' } })
      const token = jwt.sign({ id: foundUser.user_id, role: foundUser.role }, config.secret)
      return response.status(200).json({
        token,
        user: {
          user_id: foundStudent.student_id,
          role: 'student',
          email: foundStudent.email ? true : false // if the student has an email address added
        }
      })
    } else {
      // user not in database, add user
      const savedStudent = await db.Student
        .create({
          student_number: authenticatedUser.student_number,
          first_names: authenticatedUser.first_names,
          last_name: authenticatedUser.last_name,
          email: null
        })
      const savedUser = await db.User
        .create({
          role: 'student',
          role_id: savedStudent.student_id
        })
      const token = jwt.sign({ id: savedUser.user_id, role: savedUser.role }, config.secret)
      return response.status(200).json({
        token,
        user: {
          user_id: savedStudent.student_id,
          role: savedUser.role,
          email: savedStudent.email ? true : false // if the student has an email address added
        }
      })
    }
  } catch (error) {
    console.log(error.message)
    return response.status(500).json({ error: 'authentication error' })
  }
}

module.exports = loginRouter