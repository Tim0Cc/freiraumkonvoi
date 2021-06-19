const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
