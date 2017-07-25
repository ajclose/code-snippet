const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Snippet = require('../models/Snippet')


router.get("/signup", function(req, res) {
  res.render('signup')
})

router.post("/signup", function(req, res) {
  const newUsername = req.body.username
  const newEmail = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const hash = bcrypt.hashSync(password, 8)
  let usernameError;
  let passwordError;
  let emailError;
  User.findOne({
      email: newEmail
    })
    .then(function(email) {
      console.log("email",email);
      User.findOne({
        username: newUsername
      })

    .then(function(user) {
      if (!email) {
        console.log("there is no email");
        if (!user) {
          if (password === confirmPassword) {
            const user = new User()
            user.username = newUsername
            user.email = newEmail
            user.password = hash
            user.save()
              .then(function(user) {
                req.session.userid = user._id
                res.redirect("/")
              })
              .catch(function(errors) {
                console.log("errors", errors.errors);
                if (errors.errors.username) {
                  usernameError = errors.errors.username.message
                }
                if (errors.errors.email) {
                  emailError = errors.errors.email.message
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
})

module.exports = router
