const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleID: { type: String},
    displayName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String},
    profilePic: { type: String, default: "/images/user.png" },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    role: { type: String},
    class: { type: String},
    faculty: { type: String},
    access: [{ type: String }],
}, { timestamps: true });

var User = mongoose.model('User', UserSchema);
module.exports = User;