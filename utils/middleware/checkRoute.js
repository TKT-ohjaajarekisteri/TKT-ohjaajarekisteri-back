const config = require('../../config/config')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const authenticateToken = (req) => {
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, config.secret)

  if (!token || !decodedToken.id) {
    return null
  }
  return decodedToken
}

const checkUser = (req, res, next) => {
  try {
    const token = authenticateToken(req)

    if (!token) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    if (token.id === req.params.id) {
      return res.status(401).json({ error: 'not authorized user' })
    }

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: error })
    }
  }
}

const checkLogin = (req, res, next) => {
  try {
    const token = authenticateToken(req)

    if (!token) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: error })
    }
  }
}

const checkAdmin = (req, res, next) => {
  try {
    const token = authenticateToken(req)

    if (!token) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    if (token.role !== 'admin') {
      return res.status(401).json({ error: 'not admin' })
    }

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: error })
    }
  }
}

module.exports = {
  checkLogin,
  checkAdmin,
  checkUser,
  getTokenFrom,
  authenticateToken
}