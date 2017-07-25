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
  })
  .then(function(user){
    if(bcrypt.compareSync(req.body.password, user.password)) {
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

router.get("/new", auth, function(req,res) {
  res.render('new')
})

router.get("/edit/:id", function(req, res) {
  Snippet.findOne({
    _id: req.params.id
  })
  .then(function(snippet) {
      res.render('edit', {
        snippet: snippet
      })
  })
})

module.exports = router
