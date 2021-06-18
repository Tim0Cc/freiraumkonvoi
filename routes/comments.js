const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const { ensureAuthenticated, authRole } = require('../config/auth')

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
      const posts = await Post.find({})
      const users = await User.find({})
      const comments = await Comment.find({})
      res.render('posts/index', {
        posts, users, comments
      })
    } catch (error) {
      res.redirect('/')
    }
  })

  router.get('/new', ensureAuthenticated, async (req, res) => {
    try {
      const users = await User.find({})
      const post = await Post.find({})
      const comment = new Comment.find({})
      res.render('post/show', { users, post, comment })
    } catch (error) {
      console.error(error)
      res.redirect('posts')
    }
  })

  router.post('/', async (req, res) => {
    const comment = new Comment({
      post: req.body.post.id,
      comment: req.body.comment,
      user: req.body.user
    })
    try {
      await comment.save()
      res.redirect('post/show')
    } catch (error) {
      console.error(error)
      res.redirect('post/show')
    }
  })



