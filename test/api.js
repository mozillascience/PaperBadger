var request = require('request');

// test config (need to override .env and .env.dist)
process.env.SESSION_SECRET = 'test_secret'
process.env.BADGES_ENDPOINT = 'http://example.com'
process.env.BADGES_SYSTEM = 'badgekit'
process.env.BADGES_KEY = 'test_key'
process.env.BADGES_SECRET = 'test_secret'
process.env.ORCID_AUTH_CLIENT_ID = 'science'
process.env.ORCID_AUTH_SITE = 'http://example.com'
process.env.ORCID_AUTH_TOKEN_PATH = 'http://api.example.com/oauth/token'
process.env.ORCID_REDIRECT_URI = 'http://localhost:5000/orcid_auth_callback'

var app = require('../src/app.js')();

// setup nock mocking of badges endpoint
var nock = require('nock');

var scope = nock('http://example.com');

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

    scope.get('/systems/badgekit/badges?archived=any')
      .reply(200, []);

    request(app)
      .get('/badges')
      .expect('Content-Type', /json/)
      .expect([])
      .expect(200, done);
  });

});
