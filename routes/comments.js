const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const { ensureAuthenticated, authRole } = require('../config/auth')

// router.get('/new', ensureAuthenticated, async (req, res) => {
//   console.log(req.body.post)
//   try {
//     const users = await User.find({})
//     const posts = await Post.find({})
//     const post = req.body.post
//     const comment = new Comment()
//     res.render(`comments/new`, { users, posts, comment })
//   } catch (error) {
//     console.error(error)
//     res.redirect('posts')
//   }
// })

router.post('/', async (req, res) => {
  const commentText = req.body.commentText
  const user = req.user.id
  try {
    const post = await Post.findById(req.body.post)
    // const targetUser = await User.findById(req.body.targetUser)
    const comment = new Comment({
      commentText: commentText,
      user: user,
      post: post
    })
    try {
      await comment.save()
      const users = await User.find({})
      const comments = await Comment.find({})
      const newComment = new Comment()
      res.render('posts/show', { post, users, comments, newComment })
    } catch (error) {
      console.error(error)
      res.redirect('posts')
    }
  } catch (error) {
    console.error(error)
    res.redirect('posts')
  }
})

module.exports = router


