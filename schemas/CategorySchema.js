const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type:String, unique: true},
    notification: [{ type: Schema.Types.ObjectId, ref: 'Notification' }]
}, { timestamps: true });

var Category = mongoose.model('User',CategorySchema);
module.exports = Category;