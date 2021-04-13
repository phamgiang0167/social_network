const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: { type: String, trim: true },
    commentedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    onPost: {type: Schema.Types.ObjectId, ref: 'Post'}
}, { timestamps: true });

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;