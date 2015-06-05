var assert = require('assert');
var request = require('supertest');

var config = {};

var app = require('../src/app.js')(config);

describe("PaperBadger", function () {
  it("GET / fetches welcome page", function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});
