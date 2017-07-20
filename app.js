const express = require('express')
const app = express()
const mustache = require('mustache-express')
const bodyParser = require('body-parser')
const apiRoute = require('./routes/api')
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const nodeEnv = process.env.NODE_ENV || "development";
const config = require("./config")[nodeEnv]
// If we are testing, use "mongodb://127.0.0.1:27017/atm_test"
console.log("We are using config.mongoUrl", config.mongoUrl)
mongoose.connect(config.mongoUrl)

app.engine('mustache', mustache() )
app.set('view engine', 'mustache')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.listen(3000, function() {
  console.log("app is live!");
})

app.use(apiRoute)

module.exports = app
