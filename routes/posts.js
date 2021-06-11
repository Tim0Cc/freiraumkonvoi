const express = require('express')
router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')

router.get('/', (req, res) => {
  res.send('Post')
})

module.exports = router