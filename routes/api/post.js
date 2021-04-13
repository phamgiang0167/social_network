const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Comment = require('../../schemas/CommentSchema');
const session = require('express-session');
const multer  =   require('multer')
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: 'uploads/'});
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
    var results = await getPosts({});
    res.status(200).send(results)
})

router.post("/", async (req, res, next) => {
    
    if (!req.body.content) {
        console.log("Content param not sent with request");
        return res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        postedBy: req.user
    }
    Post.create(postData)
    .then(async newPost => {
        newPost = await User.populate(newPost, { path: "postedBy" })
        res.status(201).send(newPost);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})
router.post("/uploads/:id",upload.single('cropped'), async (req, res, next) => {
    if(!req.file) {
        console.log("No file uploaded with ajax request.");
        return res.sendStatus(400);
    }
    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error => {
        if(error != null) {
            console.log(error);
            return res.sendStatus(400);
        }
        await Post.findByIdAndUpdate(req.params.id, { image: filePath }, { new: true });
        var updated = await getPosts({ _id: req.params.id })
        updated  = updated [0]
        res.status(200).send(updated);
    })
})
router.put("/like/:id", async (req, res, next) => {
    var postID = req.params.id
    var userID = req.user._id
    var isLiked = req.user.likes && req.user.likes.includes(postID)
    var option = isLiked ? "$pull" : "$addToSet"
    // Insert user like
    req.user = await User.findByIdAndUpdate(userID, { [option]: { likes: postID } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    var post = await Post.findByIdAndUpdate(postID, { [option]: { likes: userID } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})

router.post("/comment", async (req, res, next) => {
    var commentData = {
        content: req.body.content,
        onPost: req.body.postId,
        commentedBy: req.user
    }
    Comment.create(commentData)
    .then(async newComment => {
        newComment = await Comment.populate(newComment, { path: "commentedBy" })
        await Comment.populate(newComment, { path: "onPost" })
        res.status(201).send(newComment);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.get("/:id", async (req, res, next) => {
    var postId = req.params.id

    var results = await getPosts({ _id: postId })
    results = results[0]

    res.status(200).send(results)
})

router.put("/:postId/comment/:commentId", async (req, res, next) => {

    var postId = req.params.postId
    var commentId = req.params.commentId

    var post = await Post.findByIdAndUpdate(postId, { ["$addToSet"]: { comments: commentId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    res.status(200).send()
})


router.get("/:id/comment", async (req, res, next) => {
    var id = req.params.id

    var comments = await getCommentsOnPost({ _id:id })
    res.status(200).send(comments)
})

router.delete("/:id", async (req, res, next)=>{
    
    var postId = req.params.id
    await Post.findByIdAndRemove({_id: postId})
    return res.status(200).send()
})
router.delete("/:id/comment", async (req, res, next)=>{
    
    var postId = req.params.id
    await Comment.deleteMany({onPost: postId})
    return res.status(200).send()
})


async function getCommentsOnPost(filter){
    var comments = await Comment.find({onPost: filter})
    .populate('commentedBy')
    .catch(error =>{
        console.log(error)
    })
    return comments
}

async function getPosts(filter) {
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate({
        path: "comments", 
        populate: {
            path: "commentedBy"
        } 
    })
    .sort({ 
        "createdAt": -1,
    })
    .catch(error => console.log(error))
    return results
}
module.exports = router;