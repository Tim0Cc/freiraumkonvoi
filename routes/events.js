const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')
const { ensureAuthenticated, authRole } = require('../config/auth')

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    let userRole 
    if (req.user.role === 'admin') { userRole = true } 
    const events = await Event.find({}).sort({date: 1}).exec()
    const backwardsEvents = await Event.find({}).sort({date: -1}).exec()
    const users = await User.find({})
    res.render('events/index', {
      userRole, events, backwardsEvents, users
    })
  } catch (error) {
    res.redirect('/')
  }
})

router.get('/new', ensureAuthenticated, async (req, res) => {
  const currentUser = req.user
  try {
    const event = new Event()
    res.render('events/new', { currentUser, event })
  } catch (error) {
    console.error(error)
    res.redirect('events')
  }
})

router.post('/', ensureAuthenticated, async (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    user: req.user
  })
  
  try {
    if (event.description.replace(/(<([^>]+)>)/g, "").length > 400) {
      const currentUser = event.user
      req.flash('error_msg', 'Der Text in der Beschreibung ist zu lang (maximal 400 Zeichen)')
      res.render('events/new', { 
        currentUser, 
        event, 
        error_msg: req.flash('error_msg')
      })
    } else {
      await event.save()
      res.redirect('events')
    }
  } catch (error) {
    console.error(error)
    res.redirect('events/new')
  }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
  let userAuth = false
  try {
    let userRole 
    if (req.user.role === 'admin') { userRole = true } 
    const currentUser = req.user
    const event = await Event.findById(req.params.id).populate('user').exec()
    if(currentUser.id == event.user.id) { userAuth = true }
    const newEvent = new Event()
    res.render('events/show', { userRole, currentUser, event, userAuth })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const currentUser = req.user
    const event = await Event.findById(req.params.id).populate('user').exec()
    res.render('events/edit', { currentUser, event })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.put('/:id', ensureAuthenticated, async (req, res) => {
  let event
  try {
    event = await Event.findById(req.params.id)
    event.title = req.body.title,
    event.description = req.body.description,
    event.date = req.body.date,
    event.user = req.user
    event.updatedAt = Date.now()
    await event.save()
    res.redirect(`/events/${event.id}`)
  } catch (error) {
    console.error(error)
    if (event != null) {
      render(`events/${event.id}`, { event })
    } else {
      redirect('/')
    }
  }
})

router.delete('/:id', ensureAuthenticated, authRole('admin'), async (req, res) => {
  let event
  try {
    event = await Event.findById(req.params.id)
    await event.remove()
    res.redirect('/events')
  } catch (error) {
    console.error(error)
    if (event != null) {
      res.render('events/show', { event })
    }
  }
})



module.exports = router
