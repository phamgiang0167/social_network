const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database")
const session = require("express-session")
const server = app.listen(port, () => console.log("Server listening on port " + port));
const passportSetup = require('./config/passport-setup')
const passport = require('passport')
app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// Routes
const authLoginRoute = require('./routes/authLoginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoute')
const profileRoute = require('./routes/profileRoutes')
const uploadRoute = require('./routes/uploadRoutes')
const loginRoute = require('./routes/loginRoutes')
const searchRoute = require('./routes/searchRoute')
//api routes
const postApiRoute = require('./routes/api/post')
const commentApiRoute = require('./routes/api/comment')
const userApiRoute = require('./routes/api/users');
const officeApiRoute = require('./routes/api/office')
const notificationRoute = require('./routes/api/notification')

app.use("/auth", authLoginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute)
app.use('/profile', middleware.requireLogin, profileRoute)
app.use('/uploads',  uploadRoute)
app.use('/login', loginRoute)
app.use('/search', searchRoute)
//api
app.use('/api/post', postApiRoute)
app.use('/api/comment', commentApiRoute)
app.use('/api/users', userApiRoute)
app.use('/api/office', officeApiRoute)
app.use('/api/notification', notificationRoute)
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user)
    }
    res.status(200).render("home", payload);
})
app.get('/manage',  (req, res)=>{

    var payload = {
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user)
    }
    res.status(200).render('manage', payload)
})


