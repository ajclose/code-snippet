const mongoose = require('mongoose')

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  body: {
    type: String,
    required: [true, "Body is required"]
  },
  language: {
    type: String,
    required: [true, "Language is required"]
  },
  notes: {
    type: String
  },
  userid: {
    type: String,
    ref: 'User'
  },
  tags: [String]
})

const Snippet = mongoose.model('Snippet', snippetSchema)

module.exports = Snippet
