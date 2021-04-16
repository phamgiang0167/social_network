const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

router.get("/", (req, res, next) => {
    
    var payload = {
        pageTitle: 'Search',
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user),
    }
    
    res.status(200).render("search", payload);
})

router.get("/:selectedTab", (req, res, next) => {
    
    var payload = {
        pageTitle: 'Search',
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user),
    }
    payload.selectedTab = req.params.selectedTab
    res.status(200).render("search", payload);
})

module.exports = router