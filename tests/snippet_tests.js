const chai = require("chai");
const assert = chai.assert;
const supertest = require("supertest");
const app = require("../app")
const User = require("../models/User")
const Snippet = require("../models/Snippet")

describe("adding a snippet", function() {
  let user = false;
  let snippet = false;
  afterEach(function(done){
    Snippet.deleteMany()
    .then(function(snippet) {
      User.deleteMany()
      .then(function(User){
        done()
      })
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
      const s = new Snippet()
      s.title = "title"
      s.body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada imperdiet commodo. Vivamus bibendum vitae quam eget accumsan. Vestibulum tincidunt, nisi et pharetra laoreet, ex nulla molestie ligula, id convallis elit tellus vehicula lorem. Mauris quis lacinia libero. Vivamus eget turpis augue. Donec ante quam, feugiat non accumsan eu, mattis at tortor. Morbi semper nibh dolor, vel posuere ligula tincidunt vel. Proin suscipit iaculis purus et placerat. Nulla at ex orci. Aliquam volutpat, erat vel dignissim dapibus, magna nulla egestas nisl, quis malesuada mi lacus ac neque. Ut tempor erat in ex imperdiet, ac consequat felis cursus. Donec porta, nisi."
      s.notes = "notes"
      s.language = "javascript"
      s.userid = user._id
      s.tags.push("tag")
      s.save()
      .then(function(s) {
        snippet = s
        done();
      })
    })
  })

  it("successfully adds a new snippet", function(done) {
    const formData = {
      title: "new title",
      body: "body",
      notes: "notes",
      language: "javascript"
    }
    supertest(app)
    .post("/api/snippets")
    .auth(user.username, user.password)
    .send(formData)
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.snippet.title, "new title")
      assert.equal(res.body.snippet.body, "body")
      assert.equal(res.body.snippet.notes, "notes")
      assert.equal(res.body.snippet.language, "javascript")
      assert.equal(res.body.snippet.userid, user._id)
    })
    .end(done)
  })

  it("returns an error if title is missing", function(done) {
    const formData = {
      body: "body",
      notes: "notes",
      language: "javascript",
      userid: user._id
    }
    supertest(app)
    .post("/api/snippets")
    .auth(user.username, user.password)
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert.equal(res.body.error.errors.title.message, "Title is required")
    })
    .end(done)
  })

  it("returns an error if body is missing", function(done) {
    const formData = {
      title: "title",
      notes: "notes",
      language: "javascript",
      userid: user._id
    }
    supertest(app)
    .post("/api/snippets")
    .auth(user.username, user.password)
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert.equal(res.body.error.errors.body.message, "Body is required")
    })
    .end(done)
  })

  it("returns an error if language is missing", function(done) {
    const formData = {
      title: "title",
      body: "body",
      notes: "notes",
      userid: user._id
    }
    supertest(app)
    .post("/api/snippets")
    .auth(user.username, user.password)
    .send(formData)
    .expect(422)
    .expect(function(res) {
      assert.equal(res.body.error.errors.language.message, "Language is required")
    })
    .end(done)
  })
})

describe("getting snippets", function() {
  let user = false;
  let snippet = false;
  afterEach(function(done){
    Snippet.deleteMany()
    .then(function(snippet) {
      User.deleteMany()
      .then(function(User){
        done()
      })
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
      const s = new Snippet()
      s.title = "title"
      s.body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada imperdiet commodo. Vivamus bibendum vitae quam eget accumsan. Vestibulum tincidunt, nisi et pharetra laoreet, ex nulla molestie ligula, id convallis elit tellus vehicula lorem. Mauris quis lacinia libero. Vivamus eget turpis augue. Donec ante quam, feugiat non accumsan eu, mattis at tortor. Morbi semper nibh dolor, vel posuere ligula tincidunt vel. Proin suscipit iaculis purus et placerat. Nulla at ex orci. Aliquam volutpat, erat vel dignissim dapibus, magna nulla egestas nisl, quis malesuada mi lacus ac neque. Ut tempor erat in ex imperdiet, ac consequat felis cursus. Donec porta, nisi."
      s.notes = "notes"
      s.language = "javascript"
      s.userid = user._id
      s.tags.push("tag")
      s.save()
      .then(function(s) {
        snippet = s
        done();
      })
    })
  })

  it("successfully returns all of a user's snippets", function(done) {
    supertest(app)
    .get("/api/snippets")
    .auth(user.username, user.password)
    .expect(200)
    .end(done)
  })

  it("successfully returns all snippets with the specified language", function(done) {
    supertest(app)
    .get("/api/snippets?language=javascript")
    .auth(user.username, user.password)
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.snippets[0].language, "javascript")
    })
    .end(done)
  })

  it("successfully returns all snippets with the specified tag", function(done) {
    supertest(app)
    .get("/api/snippets?tag=tag")
    .auth(user.username, user.password)
    .expect(200)
    .expect(function(res) {
      assert.include(res.body.snippets[0].tags, "tag")
    })
    .end(done)
  })

  it("successfully returns a specific snippet", function(done) {
    supertest(app)
    .get(`/api/snippets/${snippet._id}`)
    .auth(user.username, user.password)
    .expect(200)
    .expect(function(res) {
      assert.equal(res.body.snippet._id, snippet._id)
    })
    .end(done)
  })

})
