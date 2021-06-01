const mongoose = require('mongoose')

const agSchema = new mongoose.Schema({
  ag_name: {
  type: String,
  required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  registerDate: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('AG', agSchema)