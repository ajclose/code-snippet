const express = require('express')
const router = express.Router()
const session = require('express-session')
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Snippet = require('../models/Snippet')

router.use(session({
  secret: 'asdfjasdlfajsl;kfju',
  resave: false,
  saveUninitialized: true
}))

function auth(req, res, next) {
  if (req.session.userid) {
    User.findOne({
      _id: req.session.userid
    })
    .then(function(user) {
      req.user = user
      next()
    })
  } else {
    res.redirect('/login')
  }
}

router.get('/login', function(req, res) {
  res.render('login')
})

router.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username,
    password: req.body.password
  })
  .then(function(user){
    if(user) {
      req.session.userid = user._id
      res.redirect('/')
    } else {
      res.render('login', {
        user: user,
        errors: "Username or password is incorrect"
      })
    }
  })
})

router.get("/", auth, function(req, res) {
  res.render('homepage')
})

router.get("/logout", function(req, res) {
  req.session.destroy()
  res.redirect("/login")
})

module.exports = router
