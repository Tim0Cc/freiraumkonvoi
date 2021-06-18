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

router.get('/new', ensureAuthenticated, authRole('admin'), async (req, res) => {
  try {
    const users = await User.find({})
    const post = new Post()
    res.render('posts/new', { users, post })
  } catch (error) {
    console.error(error)
    res.redirect('posts')
  }
})

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    user: req.body.user
  })
  try {
    await post.save()
    res.redirect('posts')
  } catch (error) {
    console.error(error)
    res.redirect('posts/new')
  }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user').exec()
    const users = await User.find({})
    const comments = await Comment.find({})
    const newComment = new Comment()
    res.render('posts/show', { post, users, comments, newComment })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:id/edit', ensureAuthenticated, authRole('admin'), async (req, res) => {
  try {
    const users = await User.find({})
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { users, post })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.put('/:id', async (req, res) => {
  let post
  try {
    post = await Post.findById(req.params.id)
    post.title = req.body.title,
    post.description = req.body.description,
    post.user = req.body.user
    await post.save()
    res.redirect(`/posts/${post.id}`)
  } catch (error) {
    console.error(error)
    if (post != null) {
      render(`posts/${post.id}`, { post })
    } else {
      redirect('/')
    }
  }
})

router.delete('/:id', ensureAuthenticated, authRole('admin'), async (req, res) => {
  let post
  try {
    post = await Post.findById(req.params.id)
    await post.remove()
    res.redirect('/posts')
  } catch (error) {
    console.error(error)
    if (post != null) {
      res.render('posts/show', { post })
    }
  }
})

module.exports = router
