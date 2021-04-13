const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const passport = require('passport')
const User = require('../schemas/UserSchema');
const { route } = require('./registerRoutes');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/login", (req, res, next) => {
    
    res.status(200).render("login");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("login", payload);
        });
        
        if(user != null) {
            var result = await bcrypt.compare(req.body.logPassword, user.password);

            if(result === true) {
                req.session.user = user;
                return res.redirect("/");
            }
        }

        payload.errorMessage = "Login credentials incorrect.";
        return res.status(200).render("login", payload);
    }

    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("login");
})
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login')
})
router.get('/google', passport.authenticate('google', {
    scope:['email', 'profile']
}))

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), (req,res)=>{
    res.redirect('/')
})
module.exports = router;