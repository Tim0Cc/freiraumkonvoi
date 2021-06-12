const express = require('express')
const router = express.Router()
const User = require('../models/user')
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

module.exports = router