const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
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

router.put('/', async (req, res)=>{
    var {id, list} = req.body
    await User.findByIdAndUpdate(id, {$set: {access: list.split(',')}}, {new: true}, (error)=>{
        // console.log(error)
    })
    return res.sendStatus(200)
})

router.get('/access', async (req, res)=>{
    var office = await User.findById(req.query.id)
    return res.status(200).send(office.access)
})
router.delete('/:id', async (req, res)=>{
    var office = await User.findByIdAndDelete(req.params.id)
    return res.status(200).send()
})

router.put('/:id', async (req, res)=>{
    var {name, password, username }= req.body
    password = await bcrypt.hash(password, 10)
    User.findByIdAndUpdate(req.params.id, {displayName: name, password: password, username: username}, (err, user)=>{
        if(err) throw err
    })
    return res.sendStatus(200)
})
module.exports = router