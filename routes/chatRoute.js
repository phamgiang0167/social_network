const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res) {
    var payload = {
        pageTitle: "Message",
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user)
    }
    return res.status(200).render('message', payload)
});

module.exports = router
