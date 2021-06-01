if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')


const indexRouter = require('./routes/index')
const agRouter = require('./routes/ags')
const authenticationRouter = require('./routes/authentication')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))

app.use('/', indexRouter)
app.use('/ags', agRouter)
app.use('/', authenticationRouter)

app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT || 3000)