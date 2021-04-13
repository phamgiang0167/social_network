const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

router.post("/", async (req, res, next) => {
    var username = req.body.username.trim();
    var name = req.body.name.trim();
    var password = req.body.password;
    password = await bcrypt.hash(password, 10)

    // if(firstName && lastName && username && email && password) {
    //     var user = await User.findOne({
    //         $or: [
    //             { username: username },
    //             { email: email }
    //         ]
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         payload.errorMessage = "Something went wrong.";
    //         res.status(200).render("register", payload);
    //     });

    //     if(user == null) {
    //         // No user found
    //         var data = req.body;
    //         data.password = await bcrypt.hash(password, 10);

    //         User.create(data)
    //         .then((user) => {
    //             req.session.user = user;
    //             return res.redirect("/");
    //         })
    //     }
    //     else {
    //         // User found
    //         if (email == user.email) {
    //             payload.errorMessage = "Email already in use.";
    //         }
    //         else {
    //             payload.errorMessage = "Username already in use.";
    //         }
    //         res.status(200).render("register", payload);
    //     }
    // }
    // else {
    //     payload.errorMessage = "Make sure each field has a valid value.";
    //     res.status(200).render("register", payload);
    // }
    var user = await User.findOne({username:username})
    if(user){
        return res.status(200).send(user)
    }else{
        var newUser = await User({
            username: username,
            displayName: name,
            password: password,
            role: 'office'
        }).save()
        if(newUser){
            console.log('suc')
        }
        return res.status(201).send(newUser)
    }
})

module.exports = router;