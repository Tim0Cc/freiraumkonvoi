const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const { ensureAuthenticated, authRole } = require('../config/auth')

// CREATE comment
router.post('/', ensureAuthenticated, async (req, res) => {
  const commentText = req.body.commentText
  const user = req.user.id
  try {
    const post = await Post.findById(req.body.post).populate('user').exec()
    comment = new Comment({
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

// EDIT comment
router.get('/comments/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    const post = await Post.findById(comment.post)
    res.render('comments/edit', { comment, post })
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

// UPDATE comment
router.put('/comments/:id', async (req, res) => {
  let comment
  try {
    comment = await Comment.findById(req.params.id)
    // comment.user = await User.findById(req.user.id)
    const post = await Post.findById(comment.post)
    comment.post = post
    comment.commentText = req.body.commentText
    if (req.user.id == comment.user) {
      await comment.save()
      req.flash('success_msg', 'Sie haben den Kommentar erfolgreich geändert')
      res.redirect(`/posts/${post.id}`)
    } else {
      req.flash('error_msg', 'Sie sind nicht berechtig kommentare von anderen AGs zu bearbeiten')
      res.redirect(`/posts/${post.id}`)     
    }
  } catch (error) {
    console.error(error)
    // if (comment != null) {
    //   render(`posts/${post.id}`, { post })
    // } else {
    res.redirect('/')
    // }
  }
})

// DELETE comment
router.delete('/comments/:id', ensureAuthenticated, async (req, res) => {
  let comment
  try {
    comment = await Comment.findById(req.params.id)
    if (req.user.id == comment.user) {
      await comment.remove()
      req.flash('success_msg', 'Sie haben den Kommentar erfolgreich entfernt')
      res.redirect(`/posts/${comment.post}`)
    } else {
      req.flash('error_msg', 'Sie sind nicht berechtig kommentare von anderen AGs zu bearbeiten')
      res.redirect(`/posts/${comment.post}`)  
    }
  } catch (error) {
    console.error(error)
    if (comment.post != null) {
      req.flash('error_msg', 'Fehler beim Köschen des Kommentars')
      res.render('posts/show', { post: comment.post })
    }
  }
})

module.exports = router


