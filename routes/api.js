const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const Snippet = require('../models/Snippet')

function createTags() {
  const tags = req.body.tags.split(" ")
}

// router.get('/', function(req, res) {
//   res.render('index')
// })
//
// router.post("/api/users", function(req, res) {
//   // const username = req.body.username
//   // const email = req.body.email
//   // const password = req.body.password
//   // const hash = bcrypt.hashSync(password, 8)
//   const user = new User()
//   user.username = req.body.username
//   user.email = req.body.email
//   user.password = req.body.password
//   user.save()
//   .then(function(user) {
//     res.json(user)
//   })
//   .catch(function(error) {
//     res.status(422).json({
//       error: error,
//       user: user
//     })
//   })
// })

router.post("/api/snippets", function(req, res) {
  const snippet = new Snippet()
  snippet.title = req.body.title
  snippet.body = req.body.body
  snippet.notes = req.body.notes
  snippet.language = req.body.language
  snippet.userid = req.user._id
  snippet.tags.push(req.body.tags.split(" "))
  snippet.save()
  .then(function(snippet) {
    res.json({
      snippet: snippet
    })
  })
  .catch(function(error) {
    res.status(422).json({
      error: error
    })
  })
})

router.get("/api/snippets/:id", function(req, res) {
  Snippet.findOne({
    _id: req.params.id
  })
  .populate('userid', 'username')
  .then(function(snippet) {
    res.json({snippet: snippet})
  })
  .catch(function(error) {
    res.status(422).json({error: error})
  })
})

router.get("/api/snippets", function(req, res) {
  const queryObject = {}
    queryObject.userid = req.user._id
    if(req.query.langauge) {
      queryObject.language = new RegExp(req.query.language, 'i');
    }
    if(req.query.tag) {
      queryObject.tags = new RegExp(req.query.tag, 'i')
    }
    Snippet.find(queryObject)
    .then(function(snippets) {
      res.json({snippets: snippets})
    })
  })

  router.put("/api/snippets/:id", function(req, res) {
    Snippet.findOne({
      _id: req.params.id
    })
    .then(function(snippet) {
      snippet.title = req.body.title
      snippet.body = req.body.body
      snippet.language = req.body.language
      snippet.notes = req.body.notes
      snippet.save()
      .then(function(snippet) {
        res.json({snippet: snippet})
      })
    })
    .catch(function(error) {
      res.status(422).json({error: error})
    })
  })

  router.delete("/api/snippets/:id", function(req, res) {
    Snippet.deleteOne({
      _id: req.params.id
    })
    .then(function(snippet) {
      res.json(snippet)
    })
    .catch(function(error) {
      res.status(422).json(error)
    })
  })

  router.get("/api/logout", function(req, res) {
    console.log(req.user);
    req.session.destroy()
    res.redirect("/logout")
  })

module.exports = router
