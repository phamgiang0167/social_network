require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database")
const session = require("express-session")
const server = app.listen(port, () => console.log("Server listening on port " + port));
const passportSetup = require('./config/passport-setup')
const passport = require('passport')
const cors = require('cors')
const io = require('socket.io')(server, {pingTimeout: 60000})
//set view engine
app.set("view engine", "pug");
app.set("views", "views");
app.use(cors())
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
const chatRoute = require('./routes/chatRoute')
const newChatRoute = require('./routes/newChatRoute')
//api routes
const postApiRoute = require('./routes/api/post')
const commentApiRoute = require('./routes/api/comment')
const userApiRoute = require('./routes/api/users');
const officeApiRoute = require('./routes/api/office')
const notificationApiRoute = require('./routes/api/notification')
const chatApiRoute = require('./routes/api/chat')
const messageApiRoute = require('./routes/api/message');
const router = require('./routes/registerRoutes');
const { connect } = require('./database');
app.use("/auth", authLoginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute)
app.use('/profile', middleware.requireLogin, profileRoute)
app.use('/uploads',  uploadRoute)
app.use('/login', loginRoute)
app.use('/search', searchRoute)
app.use('/messenger', chatRoute)
app.use('/chat', newChatRoute)
//api
app.use('/api/post', postApiRoute)
app.use('/api/comment', commentApiRoute)
app.use('/api/users', userApiRoute)
app.use('/api/office', officeApiRoute)
app.use('/api/notification', notificationApiRoute)
app.use('/api/chats', chatApiRoute)
app.use('/api/messages', messageApiRoute)
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

io.on('connection', (socket)=>{
    socket.on('setup', userData =>{
        socket.join(userData._id)
        socket.emit('connected')
    })
    socket.on('join room', room =>{
        socket.join(room)
    })
    socket.on('typing', room => {
        socket.in(room).emit('typing')
    })
    socket.on('stop typing', room => {
        socket.in(room).emit('stop typing')
    })
    socket.on('new message', newMessage =>{
        var chat = newMessage.chat
        if(!chat.users) return console.log('user not defined')
        chat.users.forEach(user => {
            if(user._id == newMessage.sender._id) return
            socket.in(user._id).emit('message recieved', newMessage)
        });
    })
})