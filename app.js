const express = require('express')
const app = express()
const mustache = require('mustache-express')
const bodyParser = require('body-parser')
const apiRoute = require('./routes/api')

app.engine('mustache', mustache() )
app.set('view engine', 'mustache')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.listen(3000, function() {
  console.log("app is live!");
})

app.use(apiRoute)
