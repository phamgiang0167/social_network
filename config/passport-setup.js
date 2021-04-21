const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const key = require('./key')
const User = require('../schemas/UserSchema');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
passport.serializeUser((user, done)=>{
  done(null, user)
})

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user)
  })
  
})

passport.use(new LocalStrategy(
  (username, password, done)=>{
      
      User.findOne({username: username}).then((user)=>{
          if(!user){
              return done(null, false)
          }
          if(username == "admin" && password == user.password){
              return done(null, user)
          }
          if(bcrypt.compareSync(password, user.password)){
              return done(null, user)
          }else{
              return done(null, false)
          }
      })
  }
))
passport.use(new GoogleStrategy({
    clientID:  key.google.clientID,
    clientSecret: key.google.client_secret,
    callbackURL: "https://socialnetworktdtu.herokuapp.com/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    if(profile._json.hd != 'student.tdtu.edu.vn'){
      return done(null, false)
    }
    User.findOne({googleID: profile.id}).then((currentUser)=>{
      if(currentUser){
        done(null, currentUser)
      }else{
        new User({
          googleID: profile._json.sub,
          displayName: profile._json.name,
          username: profile._json.email,
          profilePic: profile._json.picture,
          role: "student",
          class: "",
          faculty: ""
        }).save().then((newUser)=>{
          // console.log(newUser)
          done(null, newUser)
        })
      }
    })
      
  }
));