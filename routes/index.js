const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { ensureAuthenticated, authRole } = require('../config/auth') 

// Welcome page
router.get('/', (req, res) => {
  res.render('index')
})

router.get('/tools', ensureAuthenticated, (req, res) => {
  res.render('../public/pages/tools')
})

//dashboard page
router.get('/dashboard', ensureAuthenticated, (req,res) => {
  res.render('users/dashboard', {
    user: req.user
  })
})

router.get('/datenschutz', (req, res) => {
  res.render('../public/pages/datenschutz')
})

router.get('/impressum', (req, res) => {
  res.render('../public/pages/impressum')
})

module.exports = router