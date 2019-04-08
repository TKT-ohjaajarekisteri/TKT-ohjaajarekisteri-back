const bcrypt = require('bcrypt')
const plainPassword = process.argv[2]
const saltRounds = 10
bcrypt.hash(plainPassword, saltRounds).then(hash => {
  console.log(hash)
})