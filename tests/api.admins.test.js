const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const db = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const bcrypt = require('bcrypt')
let token = null
let admin = null
const oldPass = 'password'
const newPass = 'pass'
const { passwordHasher } = require('./test_helper')

describe('tests for the admins controller', () => {
  jest.setTimeout(15000)
  beforeAll(async () => {  
    await db.User.destroy({
      where: {}
    })
  
    await db.Admin.destroy({
      where: {}
    })
  
  
    admin = await db.Admin.create({ username: 'testAdmin', passwordHash: passwordHasher(oldPass) })
    const adminUser = await db.User.create({ role: 'admin', role_id: admin.admin_id })
    token = jwt.sign({ id: adminUser.user_id, role: adminUser.role }, config.secret)

  })

  describe('Database has admins', () => {

    test('Admins password is updated correctly', async () => {
      const response = await api
        .put('/api/admins/')
        .set('Authorization', `bearer ${token}`)
        .send({ oldPassword: oldPass, newPassword: newPass })
        .expect(200)
    

      admin = await db.Admin.findByPk(admin.admin_id)
      expect(response.text).toBeDefined()
      expect(await bcrypt.compare(newPass, admin.passwordHash)).toBeTruthy()
    })
  })
})    