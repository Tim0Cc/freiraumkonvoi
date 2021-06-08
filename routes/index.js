const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth') 

// login page
router.get('/', (req, res) => {
  res.render('Welcome')
})

// register page 
router.get('/register', (req, res) => {
  res.render('register')
})

//dashboard page
router.get('/dashboard', ensureAuthenticated, (req,res)=>{
  res.render('users/dashboard', {
    user: req.user
  })
})

module.exports = router