const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Snippet = require('../models/Snippet')



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
      res.redirect('/')
    } else {
      res.render('login', {
        user: user,
        errors: "Username or password is incorrect"
      })
    }
  })
})

router.post("/api/users", function(req, res) {
  // const username = req.body.username
  // const email = req.body.email
  // const password = req.body.password
  // const hash = bcrypt.hashSync(password, 8)
  const user = new User()
  user.username = req.body.username
  user.email = req.body.email
  user.password = req.body.password
  user.save()
  .then(function(user) {
    res.json(user)
  })
  .catch(function(error) {
    res.status(422).json({
      error: error,
      user: user
    })
  })
})

module.exports = router
