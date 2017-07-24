const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Snippet = require('../models/Snippet')


router.get("/signup", function(req, res) {
  res.render('signup')
})

router.post("/signup", function(req, res) {
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
    req.session.userid = user._id
    res.redirect("/")
  })
  .catch(function(error) {
    console.log(error);
    res.render('signup',{
      error: error,
      user: user
    })
  })
})

module.exports = router
