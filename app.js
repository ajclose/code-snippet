const express = require('express')
const app = express()
const mustache = require('mustache-express')
const bodyParser = require('body-parser')
const apiRoute = require('./routes/api')
const registrationRoute = require('./routes/registration')
const mongoose = require('mongoose');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('./models/User')


const nodeEnv = process.env.NODE_ENV || "development";
const config = require("./config")[nodeEnv]
// If we are testing, use "mongodb://127.0.0.1:27017/atm_test"
console.log("We are using config.mongoUrl", config.mongoUrl)
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongoUrl)

app.engine('mustache', mustache() )
app.set('view engine', 'mustache')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

passport.use(new BasicStrategy(
  function(username, password, done) {

    User.findOne({username: username, password: password})
    .then( function(account){
      if(account){
        done(null, account)
      } else {
        done(null, false)
      }
    })
  }
));

app.listen(3000, function() {
  console.log("app is live!");
})

app.use(registrationRoute)
app.use(passport.authenticate('basic', {session: false}))
app.use(apiRoute)

module.exports = app
