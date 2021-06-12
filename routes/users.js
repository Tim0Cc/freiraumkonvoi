const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const { ensureAuthenticated, authRole } = require('../config/auth')

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({})
    res.render('users/index', { users })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const posts = await Post.find({}).where('user').equals(`${user.id}`).exec()
    res.render('users/show', { user, posts })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

module.exports = router