
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({ extended: false }));
router.get('/', function(req, res) {
    var payload = {
        pageTitle: "New message",
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user)
    }
    return res.status(200).render('new_message', payload)
});

module.exports = router