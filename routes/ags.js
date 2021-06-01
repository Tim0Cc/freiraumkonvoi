const express = require('express')
const router = express.Router()
const Ag = require('../models/ag')

router.get('/', checkAuthenticated, async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const ags = await Ag.find(searchOptions)
    res.render('ags/index', { 
      ags: ags,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/new', (req, res) => {
  res.render('ags/new', { ag: new Ag() })
})

router.post('/', async (req, res) => {
  const ag = new Ag({
    name: req.body.name
  })
  try {
    const newAg = await ag.save()
    // res.redirect(`ags/${newAg.id}`)
    res.redirect('ags')
  } catch {
    res.render('ags/new', { 
      ag: ag,
      errorMessage: 'Fehler beim Erstellen der AG'
    })
  }
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}



module.exports = router