const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const { ensureAuthenticated, authRole } = require('../config/auth')

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({})
    res.render('users/index', { users })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const posts = await Post.find({}).where('user').equals(`${user.id}`).exec()
    res.render('users/show', { user, posts })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:id/edit', ensureAuthenticated, authRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.render('users/edit', { user })
  } catch (error) {
    if (user != null) {
      res.render('/show', { user })
    } else {
      console.error(error)
      res.redirect('/')
    }
  }
})

router.put('/:id', async (req, res) => {
  let user
  try {
    user = await User.findById(req.params.id)
    user.name = req.body.name
    user.contact = req.body.contact
    user.description = req.body.description
    user.statusOfWork = req.body.statusOfWork
    await user.save()
    res.redirect(`/users/${user.id}`)
  } catch (error) {
    if (user != null) {
      res.render('/show', { user })
    } else {
      console.error(error)
      res.redirect('/')
    }
  }
})

router.delete('/:id', ensureAuthenticated, authRole('admin'), async (req, res) => {
  let user
  try {
    user = await User.findById(req.params.id)
    await user.remove()
    res.redirect('/users')
  } catch (error) {
    if (user != null) {
      res.render('/show', { user })
    } else {
      console.error(error)
      res.redirect('/')
    }
  }
})

module.exports = router