var assert = require('assert');
var request = require('supertest');

// provide a session secret for testing
var config = {
  SESSION_SECRET: 'test_secret',
  BADGES_ENDPOINT: 'http://example.com',
  BADGES_SYSTEM: 'badgekit',
  BADGES_KEY: 'test_key',
  BADGES_SECRET: 'test_secret'
}

var app = require('../src/app.js')(config);

// setup nock mocking of badges endpoint
var nock = require('nock');

var scope = nock('http://example.com')
  .log(console.log)
  .get('/systems/badgekit/badges?archived=any')
  .reply(200, []);

describe("PaperBadger", function () {

  // route: /
  it("GET / fetches welcome page", function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  // route: /badges
  it("GET /badges returns list of badges", function (done) {
    request(app)
      .get('/badges')
      .expect('Content-Type', /json/)
      .expect([])
      .expect(200, done);
  });

});
