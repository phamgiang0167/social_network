const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const passport = require('passport')
const User = require('../schemas/UserSchema');
const { route } = require('./registerRoutes');
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', function(req, res) {
    res.render('login')
});
 router.post('/', passport.authenticate('local', { successReturnToOrRedirect: '/manage', failureRedirect: '/login' }), (req, res)=>{
    
 });
module.exports = router
