const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'basic'
  },
  registerDate: {
    type: Date,
    // required: true,
    default: Date.now
  },
  description: {
    type: String
  },
  contact: {
    type: String
  },
  statusOfWork: {
    type: String
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User