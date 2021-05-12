const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Comment = require('../../schemas/CommentSchema');
const Notification = require('../../schemas/NotificationSchema')
const session = require('express-session');
const { findByIdAndUpdate } = require('../../schemas/UserSchema');
app.use(bodyParser.urlencoded({ extended: false }));
router.post('/', async (req, res)=>{
    var noti = await Notification(req.body).save()
    noti.postedBy = await User.findById(req.body.postedBy)
    return res.status(200).send(noti)
})

router.get('/office/:id', async (req, res)=>{
    var results = await Notification.find({postedBy: req.params.id})
    return res.status(200).send(results)
})
router.get('/office', async (req, res)=>{
    var perPage = 10
    var page = req.query.page || 1
    if(req.query.id && req.query.id != 'undefined'){
        var count = await Notification.find({postedBy: req.query.id})
        var count = count.length
        var data = await Notification.find({postedBy: req.query.id})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ 
            "createdAt": -1,
        })
        .exec((err, listNoti) => {
            var data = {
                listNoti: listNoti,
                currentPage: page,
                pages: Math.ceil(count / perPage)
            }
            return res.status(200).send(data)
        })
    }else{
        var count = await Notification.find({})
        var count = count.length
        var data = await Notification.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ 
            "createdAt": -1,
        })
        .exec((err, listNoti) => {
            var data = {
                listNoti: listNoti,
                currentPage: page,
                pages: Math.ceil(count / perPage)
            }
            return res.status(200).send(data)
        })
    }
   
    
})
router.delete('/:id', async (req, res)=>{
    await Notification.findByIdAndDelete(req.params.id)
    return res.sendStatus(200)
})

router.put('/:id', async (req, res)=>{
    var {title, content, category }= req.body
    console.log(req.body)
    Notification.findByIdAndUpdate(req.params.id, {title: title, content: content, category: category}, (err, notification)=>{
        if(err) throw err
    })
    return res.sendStatus(200)
})
module.exports = router