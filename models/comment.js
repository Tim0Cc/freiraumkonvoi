const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
    post: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    ],
    comment: {
        type: Text,
        required: true
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

module.exports = Schema
