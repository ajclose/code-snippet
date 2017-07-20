const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"]
  },
  snippets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet'
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User
