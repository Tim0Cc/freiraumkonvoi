if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
  passport, 
  ag_name => users.find(user => user.ag_name === ag_name),
  id => users.find(user => user.id === id)
)

const users = []  // CHANGE for PRODUCTION

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET, // set session_secret generated
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { ag_name: req.user.ag_name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('authentication/login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('authentication/register.ejs')
})

// CHECK if AG_name already exists
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const regToken = req.body.reg_token
    if (regToken !== process.env.REGISTER_TOKEN) {
      return res.redirect('/register')
    } else {
      users.push({
        id: Date.now().toString(),
        ag_name: req.body.ag_name,
        email: req.body.email,
        password: hashedPassword,
        registerDate: Date.now()
      })
    }
    res.redirect('/login')
  } catch {
    res.redirect('/register')
    // ADD MerrorMessage && prefill from req
  }
  console.log(users)
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
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

app.listen(process.env.BASE_URL || 3000)