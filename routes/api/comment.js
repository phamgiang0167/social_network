const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Comment = require('../../schemas/CommentSchema');
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));


router.delete("/:id", async (req, res, next)=>{
    await Comment.findByIdAndRemove({_id: req.params.id})
    return res.status(200).send()
})
router.put("/:id/:content", async (req, res, next)=>{
    await Comment.findByIdAndUpdate(req.params.id, {content: req.params.content}, (err, comment)=>{
        if(err) throw err
    })
    return res.status(200).send()
})
module.exports = router;