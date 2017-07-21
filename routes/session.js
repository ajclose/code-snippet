const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Snippet = require('../models/Snippet')

router.get("/", function(req, res) {
  res.render('homepage')
})

module.exports = router
