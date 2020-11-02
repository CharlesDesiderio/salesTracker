const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName : {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User