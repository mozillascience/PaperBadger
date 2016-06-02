'use strict';

var request = require('supertest');
var assert = require('assert');

var testEnv = require('../../src/environments');

var badgeClient = require('../../src/badges/client')(testEnv);
var badgeService = require('../../src/badges/service');
badgeService.init(badgeClient, testEnv);

var app = require('../../src/app.js');

describe('Integration test against the real Badge server', function () {
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

  it('render JSON data in pug with the pretty param', function (done) {
    request(app)
        .get('/badges?pretty=true')
        .expect('Content-Type', /html/)
        .expect(200, done);
  });

  it('get a count of all the badges', function (done) {
    request(app)
      .get('/badges/count')
      .expect(function (res) {
        assert.ok(res.body > 0, 'no badges found');
      })
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

  it('get a count of all badge instances of a certain badge', function (done) {
    request(app)
      .get('/badges/formal_analysis/count')
      .expect(function (res) {
        assert.ok(res.body > 0, 'no badges found');
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

  it('get a count of all badge instances earned by a user', function (done) {
    request(app)
      .get('/users/0000-0003-4959-3049/badges/count')
      .expect(function (res) {
        assert.ok(parseInt(res.body, 10) > 0, 'no badges found');
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

  it('get a count of all badge instances of a certain badge earned by a user', function (done) {
    request(app)
      .get('/users/0000-0003-4959-3049/badges/writing_review/count')
      .expect(function (res) {
        assert.ok(res.body > 0, 'no badges found');
      })
      .expect(200, done);
  });

  it('get all badges of a certain paper', function (done) {
    request(app)
      .get('/papers/10.1186/2047-217X-2-10/badges/')
      .expect(function (res) {
        assert.ok(res.body[0].slug, 'not find one badge slug in json');
        assert.equal(res.body[0].badge.name, 'Data curation');
        assert.equal(res.body[0].evidenceUrl, 'http://dx.doi.org/10.1186/2047-217X-2-10');
      })
      .expect(200, done);
  });

  it('get the number of badges of a certain paper', function (done) {
    request(app)
      .get('/papers/10.1186/2047-217X-2-10/badges/count')
      .expect(function (res) {
        assert.ok(parseInt(res.body, 10) > 0, 'no badges found');
      })
      .expect(200, done);
  });

  it('get all badge instances of a certain badge for a paper', function (done) {
    request(app)
        .get('/papers/10.1186/2047-217X-2-10/badges/investigation')
        .expect(function (res) {
          assert.ok(res.body[0].slug, 'not find one badge slug in json');
          assert.equal(res.body[0].badge.name, 'Investigation');
          assert.equal(res.body[0].evidenceUrl, 'http://dx.doi.org/10.1186/2047-217X-2-10');
        })
        .expect(200, done);
  });

  it('get the badge count for instances of a certain badge for a paper', function (done) {
    request(app)
      .get('/papers/10.1186/2047-217X-2-10/badges/investigation/count')
      .expect(function (res) {
        assert.ok(res.body > 0, 'no badges found');
      })
      .expect(200, done);
  });

  it('get all badge instances earned by a user for a paper.', function (done) {
    request(app)
        .get('/papers/10.1186/2047-217X-2-10/users/0000-0002-3881-294X/badges')
        .expect(function (res) {
          assert.ok(res.body[0].slug, 'not find one badge slug in json');
          assert.equal(res.body[0].orcid, '0000-0002-3881-294X');
          assert.equal(res.body[0].evidenceUrl, 'http://dx.doi.org/10.1186/2047-217X-2-10');
        })
        .expect(200, done);
  });

  it('get a count of all badge instances earned by a user for a paper.', function (done) {
    request(app)
      .get('/papers/10.1186/2047-217X-2-10/users/0000-0002-3881-294X/badges/count')
      .expect(function (res) {
        assert.ok(res.body > 0, 'no badges found');
      })
      .expect(200, done);
  });

  it('get all badge instances of a certain badge earned by a user for a paper.', function (done) {
    request(app)
        .get('/papers/10.1186/2047-217X-2-10/users/0000-0002-3881-294X/badges/investigation')
        .expect(function (res) {
          assert.ok(res.body[0].slug, 'not find one badge slug in json');
          assert.equal(res.body[0].badge.name, 'Investigation');
          assert.equal(res.body[0].orcid, '0000-0002-3881-294X');
          assert.equal(res.body[0].evidenceUrl, 'http://dx.doi.org/10.1186/2047-217X-2-10');
        })
        .expect(200, done);
  });

  it('get a count of all badge instances of a certain badge earned by a user for a paper.', function (done) {
    request(app)
      .get('/papers/10.1186/2047-217X-2-10/users/0000-0002-3881-294X/badges/investigation/count')
      .expect(function (res) {
        assert.ok(res.body <= 1, 'no badges found');
      })
      .expect(200, done);
  });
});
