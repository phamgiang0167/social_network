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

router.post('/userImage', upload.single('cropped'), async (req,res,next)=>{
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
        req.user = await User.findByIdAndUpdate(req.user._id, { profilePic: filePath }, { new: true });
        res.sendStatus(204);
    })
})

router.put('/:idUser', async (req,res)=>{
    var option = ""
    var value = ""
    if(req.body.newName){
        value = req.body.newName
        await User.findByIdAndUpdate(req.params.idUser, {displayName: value}, (err, user)=>{
            if(err) throw err
        })
    }else if(req.body.newClass){
        option = 'class'
        value = req.body.newClass
    }else{
        option = 'falculty'
        value = req.body.newFalculty
    }
    return res.status(200).send()
})

router.get('/office', async (req, res)=>{
    var results = await User.find({role: 'office'})
    return res.status(200).send(results)
})
module.exports = router