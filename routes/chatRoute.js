const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const Chat = require('../schemas/ChatSchema')
const User = require('../schemas/UserSchema') 
const mongoose = require('mongoose')
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res) {
    var payload = {
        pageTitle: "Message",
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user)
    }
    return res.status(200).render('message', payload)
});
router.get('/:chatId', async function(req, res) {
    var userId = req.user._id;
    var chatId = req.params.chatId;
    var isValidId = mongoose.isValidObjectId(chatId);

    var chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } })
    .populate("users")
    var payload = {
        pageTitle: "Chat",
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user),
        chat: chat
    };

    

    res.status(200).render("chatBox", payload);
});



module.exports = router
