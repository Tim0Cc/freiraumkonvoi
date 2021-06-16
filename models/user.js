const mongoose = require('mongoose')
const Post = require('./post')

const userSchema = new mongoose.Schema({
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

userSchema.pre('remove', function(next) {
  Post.find({ user: this.id }, (err, posts) => {
    if (err) {
      next(err)
    } else if (posts.length > 0) {
      next(new Error('Diese AG hat noch Beiträge. Sie können die AG erst löschen, wenn Sie alle ihre Beiträge gelöscht haben'))
    } else {
      next()
    }
  })
})

const User = mongoose.model('User', userSchema)

module.exports = User