if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const app = express()
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

require("./config/passport")(passport)

const authRouter = require('./routes/auth')
const commentsRouter = require('./routes/comments')
const indexRouter = require('./routes/index')
const postsRouter = require('./routes/posts')
const usersRouter = require('./routes/users')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayout)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))
// app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET, // set session_secret generated
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

app.use('/auth', authRouter)
app.use('/posts/:id', commentsRouter)
app.use('/', indexRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

app.listen(process.env.PORT || 3000)