var request = require('supertest');
var assert = require('assert');

process.env.BADGES_ENDPOINT = 'http://badgekit-api-sciencelab.herokuapp.com/'
process.env.BADGES_SYSTEM = 'badgekit'
process.env.BADGES_KEY = 'master'
process.env.BADGES_SECRET = 'sciencelab'

var badgeClient = require('../src/badgeClient.js')(process.env);
var badgeService = require('../src/badgeService.js')(badgeClient, process.env);
var app = require('../src/app.js')(badgeService);

describe("Intergration test against the real Badge server", function () {

  it('get all the badges', function (done) {
    request(app)
      .get('/badges')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        assert.ok(res.body[0].slug, "find one badge slug");
      })
      .expect(200, done);
  });

  it('render JSON data in code jade if ask pretty', function (done) {
    request(app)
      .get('/badges?pretty=true')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('get all badge instances of a certain badge', function (done) {
    request(app)
      .get('/badges/formal_analysis')
      .expect('Content-Type', /json/)
      .expect(function (res) {        
        assert.equal(res.body[0].badge.name, "Formal analysis");
        assert.equal(res.body[0].orcid, "0000-0003-4959-3049");
        //assert.equal(res.body[0].email, null); ?? bug??
      })      
      .expect(200, done);
  });

  it('get all badge instances earned by a user', function (done) {
    request(app)
    .get('/users/0000-0003-4959-3049/badges')
    // .expect('Content-Type', /json/)
    .expect(function (res) {
      // console.log("badgesreturn:" + JSON.stringify(res.body, null, 2));          
      assert.ok(res.body[0].slug, "find one badge slug");
      assert.equal(res.body[0].orcid, "0000-0003-4959-3049");
    })
    .expect(200, done);
  });

});
