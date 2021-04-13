const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Comment = require('../../schemas/CommentSchema');

const session = require('express-session');
const { findByIdAndUpdate } = require('../../schemas/UserSchema');
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res)=>{
    var listAccount = await User.find({role: 'office'})
    return res.status(200).send(listAccount)
})
router.get('/:id', async (req, res)=>{
    var office = await User.findOne({_id: req.params.id})
    return res.status(200).send(office)
})
router.put('/', async (req, res)=>{
    var {id, list} = req.body
    await User.findByIdAndUpdate(id, {$set: {access: list.split(',')}}, {new: true}, (error)=>{
        // console.log(error)
    })
    return res.sendStatus(200)
})

router.get('/access', async (req, res)=>{
    var obj = await User.findOne({_id: req.query.id})
    return res.status(200).send(obj.access)
})

module.exports = router