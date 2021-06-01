if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const Ag = require('../models/ag')

router.get('/', (req, res) => {
  res.send('Im authentication Router')
})

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('../passport-config')
initializePassport(
  passport, 
  username => await Ag.find({ ag_name : username }),
  id => Ag.findById(id),
  // id => users.find(user => user.id === id)
)

router.use(flash())
router.use(session({
  secret: process.env.SESSION_SECRET, // set session_secret generated
  resave: false,
  saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())


// LOGIN ROUTES

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('authentication/login.ejs')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/ags',
  failureRedirect: '/login',
  failureFlash: true
}))


// REGEISTER ROUTES

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('authentication/register.ejs', new Ag())
})

// CHECK if AG_name already exists
router.post('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const regToken = req.body.reg_token
  const ag = new Ag({
    ag_name: req.body.ag_name,
    email: req.body.email,
    password: hashedPassword,
    registerDate: Date.now()
  })
  try {   
    if (regToken !== process.env.REGISTER_TOKEN) {
      return res.render('authentication/register', { errorMessage: "Registrierungstoken nicht korrekt. Bitte wenden Sie sich an den Administrator." })
    } else {
      const newAg = await ag.save()
    }
    res.redirect('/login')
  } catch {
    res.redirect('/register')
    // ADD ErrorMessage && prefill from req
  }
})


// DELETE ROUTE

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/ags')
  }
  next()
}

// function checkNewUserName(req, res, next) {
//   const existingUser = User.find(ag_name = req.body.ag_name)
//   if (existingUser != null) {
//     return res.redirect('/register')
//   }
//   next()
// }

module.exports = router