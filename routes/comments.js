const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const { ensureAuthenticated, authRole } = require('../config/auth')

// CREATE comment
router.post('/', ensureAuthenticated, async (req, res) => {
  let userRole 
  if (req.user.role === 'admin') { userRole = true } 
  const currentUser = req.user
  const commentText = req.body.commentText
  try {
    const post = await Post.findById(req.body.post).populate('user').exec()
    comment = new Comment({
      commentText: commentText,
      user: currentUser.id,
      post: post
    })
    try {
      const users = await User.find({})
      const comments = await Comment.find({}).sort({updatedAt: -1}).exec()
      let postComments = []
      comments.forEach(comment => {
        if(post.id == comment.post) {
          postComments.push(comment)
        }
      })
      if (postComments.some(postComment => postComment.user == currentUser.id)) {
        req.flash('error_msg', 'Sie haben diesen Beitrag bereits kommentiert. Es ist nur ein Kommentar pro Beitrag pro AG erlaubt. Bitte bearbeiten Sie Ihren ursprünglichen Kommentar oder wenden Sie sich direkt an die AG über den hinterlegten Kontakt.')
        return res.redirect(`/posts/${post.id}`)  
      } else {
        thisComment = await comment.save()
        postComments.unshift(thisComment)
      }
      let commentAuth = false
      if(currentUser.id == comment.user.id) { commentAuth = true }
      const newComment = new Comment()
      let userAuth = true
      res.render('posts/show', { userRole, currentUser, post, users, postComments, newComment, commentAuth, userAuth })
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
router.put('/comments/:id', ensureAuthenticated, async (req, res) => {
  let comment
  try {
    comment = await Comment.findById(req.params.id)
    const post = await Post.findById(comment.post)
    comment.post = post
    comment.commentText = req.body.commentText
    comment.updatedAt = Date.now()
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
    res.redirect('/')
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


