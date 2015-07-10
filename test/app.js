var request = require('supertest');
var assert = require('assert');

var testEnv = require('../src/environments');

var badgeClient = require('../src/badgeClient.js')(testEnv);
var badgeService = require('../src/badgeService.js')(badgeClient, testEnv);
var app = require('../src/app.js')(badgeService);

function before() {
  // without this function declare, jshint report error about before not defined ...
}

describe('Intergration test against the real Badge server', function () {
  before(function () {
    assert.ok(testEnv.get('BADGES_ENDPOINT'), 'should set up BADGES_ENDPOINT in your test environment');
    assert.ok(testEnv.get('BADGES_KEY'), 'should set up BADGES_KEY in your test environment');
    assert.ok(testEnv.get('BADGES_SECRET'), 'should set up BADGES_SECRET in your test environment');
    assert.ok(testEnv.get('BADGES_SYSTEM'), 'should set up BADGES_SYSTEM in your test environment');
  });

  it('get all the badges', function (done) {
    request(app)
      .get('/badges')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        assert.ok(res.body[0].slug, 'not find badge slug in json');
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
        assert.ok(res.body[0].slug, 'not find badge slug in json');
        assert.equal(res.body[0].badge.name, 'Formal analysis');
        // assert.equal(res.body[0].email, null); ?? bug??
      })
      .expect(200, done);
  });

  it('get all badge instances earned by a user', function (done) {
    request(app)
      .get('/users/0000-0003-4959-3049/badges')
      .expect('Content-Type', /json/)
      .expect(function (res) {
        assert.ok(res.body[0].slug, 'not find one badge slug in json');
        assert.equal(res.body[0].orcid, '0000-0003-4959-3049');
      })
      .expect(200, done);
  });

  it('get all badge instances of a certain badge earned by a user', function (done) {
    request(app)
      .get('/users/0000-0003-4959-3049/badges/writing_review')
      .expect(function (res) {
        assert.ok(res.body[0].slug, 'not find one badge slug in json');
        assert.equal(res.body[0].badge.name, 'Writing - review & editing');
        assert.equal(res.body[0].orcid, '0000-0003-4959-3049');
      })
      .expect(200, done);
  });

  it('get all badge instances of a certain badge for a paper.', function (done) {
    request(app)
      .get('/papers/10.1371/journal.pbio.1002126/badges/investigation')
      .expect(function (res) {
        assert.ok(res.body[0].slug, 'not find one badge slug in json');
        assert.equal(res.body[0].badge.name, 'Investigation');
        assert.equal(res.body[0].evidenceUrl, 'http://dx.doi.org/10.1371/journal.pbio.1002126');
      })
      .expect(200, done);
  });

  it('get all badge instances earned by a user for a paper.', function (done) {
    request(app)
      .get('/papers/10.1371/journal.pbio.1002126/users/0000-0003-4959-3049/badges')
      .expect(function (res) {
        assert.ok(res.body[0].slug, 'not find one badge slug in json');
        assert.equal(res.body[0].orcid, '0000-0003-4959-3049');
        assert.equal(res.body[0].evidenceUrl, 'http://dx.doi.org/10.1371/journal.pbio.1002126');
      })
      .expect(200, done);
  });

  it('get all badge instances of a certain badge earned by a user for a paper.', function (done) {
    request(app)
      .get('/papers/10.1371/journal.pbio.1002126/users/0000-0003-4959-3049/badges/investigation')
      .expect(function (res) {
        assert.ok(res.body[0].slug, 'not find one badge slug in json');
        assert.equal(res.body[0].badge.name, 'Investigation');
        assert.equal(res.body[0].orcid, '0000-0003-4959-3049');
        assert.equal(res.body[0].evidenceUrl, 'http://dx.doi.org/10.1371/journal.pbio.1002126');
      })
      .expect(200, done);
  });
});
