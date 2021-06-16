const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const { ensureAuthenticated, authRole } = require('../config/auth')
const { rawListeners } = require('../models/post')

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const targetUsers = await User.find({})
    res.render('users/index', { targetUsers })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id)
    const posts = await Post.find({}).where('user').equals(`${targetUser.id}`).exec()
    res.render('users/show', { targetUser, posts })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:id/edit', ensureAuthenticated, authRole('admin'), async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id)
    res.render('users/edit', { targetUser })
  } catch (error) {
    if (user != null) {
      res.render('users/show', { targetUser })
    } else {
      console.error(error)
      res.redirect('/')
    }
  }
})

router.put('/:id', async (req, res) => {
  let targetUser
  try {
    targetUser = await User.findById(req.params.id)
    targetUser.name = req.body.name
    targetUser.contact = req.body.contact
    targetUser.description = req.body.description
    targetUser.statusOfWork = req.body.statusOfWork
    await targetUser.save()
    res.redirect(`/users/${targetUser.id}`)
  } catch (error) {
    if (targetUser != null) {
      res.render('users/show', { targetUser })
    } else {
      console.error(error)
      res.redirect('/')
    }
  }
})

router.delete('/:id', ensureAuthenticated, authRole('admin'), async (req, res) => {
  let targetUser
  try {
    targetUser = await User.findById(req.params.id)
    await targetUser.remove()
    res.redirect('/users')
  } catch (error) {
    if (targetUser == null) {
      console.error(error)
      res.redirect('/')
    } else {
      req.flash('error_msg', error.message)
      res.redirect(`/users/${targetUser.id}`)
    }
  }
})

module.exports = router