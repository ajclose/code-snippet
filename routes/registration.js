const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Snippet = require('../models/Snippet')


router.get("/signup", function(req, res) {
  res.render('signup')
})

router.post("/signup", function(req, res) {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const hash = bcrypt.hashSync(password, 8)
  let usernameError;
  let passwordError;
  let emailError;
  User.findOne({
      email: email
    })
    .then(function(email) {
      User.findOne({
        username: username
      })
    })
    .then(function(user) {
      if (!email) {
        if (!user) {
          if (password === confirmPassword) {
            const user = new User()
            user.username = username
            user.email = email
            user.password = hash
            user.save()
              .then(function(user) {
                req.session.userid = user._id
                res.redirect("/")
              })
              .catch(function(errors) {
                if (errors.errors.username) {
                  usernameError = errors.errors.username.message
                  console.log(usernameError);
                }
                if (errors.errors.email) {
                  emailError = errors.errors.email.message
                  console.log(emailError);
                  if (errors.errors.password) {
                    passwordError = errors.errors.password.message
                  }
                }
              })
          } else {
            passwordError = "Passwords don't match"
          }
        } else {
          usernameError = "That username already exists"
        }
      } else {
        emailError = "That email address is already registered"
      }
      res.render('signup', {
        usernameError: usernameError,
        passwordError: passwordError,
        emailError: emailError,
        user: user
      })
    })
})

module.exports = router
