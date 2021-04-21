const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');
const Message = require('../../schemas/MessageSchema');
const { result } = require('lodash');
app.use(bodyParser.urlencoded({ extended: false }));

router.post('/', async (req, res) =>{
    if(!req.body.content || !req.body.chatId){
        console.log('invalid')
        return res.sendStatus(400)
    }

    var newMessage = {
        sender: req.user._id,
        content: req.body.content,
        chat: req.body.chatId
    }

    Message.create(newMessage)
    .then(async message =>{
        message = await message.populate("sender").execPopulate()
        message = await message.populate("chat").execPopulate()
        message = await User.populate(message, {path: 'chat.users'})
        await Chat.findByIdAndUpdate(req.body.chatId, {lastestMessage: message})
        .catch(err =>{
            console.log(err)
        })
        res.status(201).send(message)
    })
    .catch(err=>{
        console.log(err)
        return res.sendStatus(400)
    })
})
module.exports = router