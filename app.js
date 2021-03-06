const express = require('express')
const app = express()
const mustache = require('mustache-express')
const bodyParser = require('body-parser')
const apiRoute = require('./routes/api')
const registrationRoute = require('./routes/registration')
const homepageRoute = require('./routes/session')
const mongoose = require('mongoose');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('./models/User')
const bcrypt = require('bcryptjs')


// const nodeEnv = process.env.NODE_ENV || "development";
// const config = require("./config")[nodeEnv]
// // If we are testing, use "mongodb://127.0.0.1:27017/atm_test"
// console.log("We are using config.mongoUrl", config.mongoUrl)
mongoose.Promise = require('bluebird');
const mongoURL = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/snippets"
mongoose.connect(mongoURL)

app.engine('mustache', mustache() )
app.set('view engine', 'mustache')
app.set("layout", 'layout')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("app is live!");
})

app.use(registrationRoute)
app.use(homepageRoute)
passport.use(new BasicStrategy(
  function(username, password, done) {

    User.findOne({username: username})
    .then( function(account){
      if(bcrypt.compareSync(password, account.password)){
        done(null, account)
      } else {
        done(null, false)
      }
    })
  }
));
app.use(passport.authenticate('basic', {session: false}))
app.use(apiRoute)

module.exports = app
