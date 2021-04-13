const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    title: {type: String},
    content: {type: String},
    category: {type : String},
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

var Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;