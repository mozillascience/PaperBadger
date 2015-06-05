var assert = require('assert');
var request = require('supertest');

// provide a session secret for testing
var config = {
  SESSION_SECRET: 'test_secret'
}

var app = require('../src/app.js')(config);

describe("PaperBadger", function () {
  it("GET / fetches welcome page", function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});
