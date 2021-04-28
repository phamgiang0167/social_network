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
    await Notification(req.body).save()
    return res.status(200).send()
})

router.get('/office/:id', async (req, res)=>{
    var results = await Notification.find({postedBy: req.params.id})
    return res.status(200).send(results)
})
router.get('/office/:id/:page', async (req, res)=>{
    var perPage = 3
    var page = req.params.page || 1
    var count = await Notification.find({postedBy: req.params.id})
    var count = count.length
    var data = await Notification.find({postedBy: req.params.id})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('postedBy')
    .exec((err, listNoti) => {
        var data = {
            listNoti: listNoti,
            currentPage: page,
            pages: Math.ceil(count / perPage)
        }
            
        return res.status(200).send(data)
      })
    
})

module.exports = router