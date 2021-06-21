const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { ensureAuthenticated, authRole } = require('../config/auth') 

// login page
router.get('/', (req, res) => {
  res.render('index')
})

// register page 
// router.get('/register', (req, res) => {
//   res.render('register')
// })

//dashboard page
router.get('/dashboard', ensureAuthenticated, (req,res) => {
  res.render('users/dashboard', {
    user: req.user
  })
})

//admindashboard page
router.get('/admindashboard', ensureAuthenticated, authRole('admin'), (req,res) => {
  res.render('users/admindashboard', {
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