const chai = require("chai");
const assert = chai.assert;
const supertest = require("supertest");
const app = require("../app")
const User = require("../models/User")

describe("account registration", function() {
  let user = false;
  afterEach(function(done){
    User.deleteMany().then( function(){
      done()
    })
  })
  beforeEach(function(done){
    const u = new User()
    u.username = "test"
    u.password = "password"
    u.email = "test@test.com"
    u.save()
    .then( function(u){
      user = u;
      done();
    })
  })

  it("should successfully register a new user", function(done) {
    const formData = {
      username: "newuser",
      email: "email@email.com",
      password: "password"
    }
    supertest(app)
    .post('/signup')
    .send(formData)
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.username, "newuser")
      assert.equal(res.body.email, "email@email.com")
      assert.exists(res.body.password)
    })
    .end(done)
  })

  it("should send an error if the username is missing", function(done) {
    const formData = {
      email: "email@email.com",
      password: "password"
    }
    supertest(app)
    .post('/signup')
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert.equal(res.body.error.errors.username.message, "Username is required")
    })
    .end(done)
  })

  it("should send an error if the email is missing", function(done) {
    const formData = {
      username: "newuser",
      password: "password"
    }
    supertest(app)
    .post('/signup')
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert.equal(res.body.error.errors.email.message, "Email is required")
    })
    .end(done)
  })

  it("should send an error if the password is missing", function(done) {
    const formData = {
      username: "newuser",
      email: "email@email.com"
    }
    supertest(app)
    .post('/signup')
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert.equal(res.body.error.errors.password.message, "Password is required")
    })
    .end(done)
  })

  it("should send an error if the username already exists", function(done) {
    const formData = {
      username: user.username,
      email: "email@email.com",
      password: "password"
    }
    supertest(app)
    .post('/signup')
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert(res.body.error)
    })
    .end(done)
  })

  it("should send an error if the email already exists", function(done) {
    const formData = {
      username: "newuser",
      email: user.email,
      password: "password"
    }
    supertest(app)
    .post('/signup')
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert(res.body.error)
    })
    .end(done)
  })

})
