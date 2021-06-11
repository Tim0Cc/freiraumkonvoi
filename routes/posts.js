const express = require('express')
router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({})
    const users = await User.find({})
    res.render('posts/index', {
      posts, users
    })
  } catch (error) {
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  try {
    const users = await User.find({})
    const post = new Post()
    res.render('posts/new', { users, post })
  } catch (error) {
    console.error(error)
  }
})

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    user: req.body.user
  })
  console.log(post)
  try {
    await post.save()
    res.redirect('posts')
  } catch (error) {
    console.log(error)
    res.redirect('posts/new')
  }
})

module.exports = router