// var request = require('supertest');

// var Habitat = require('habitat');
// Habitat.load('env.test');
// var testEnv = new Habitat();

// var badgeClient = require('../src/badgeClient.js')(testEnv);
// var badgeService = require('../src/badgeService.js')(badgeClient, testEnv);
// var app = require('../src/app.js')(badgeService);

// // setup nock mocking of badges endpoint
// var nock = require('nock');

// var scope = nock('http://example.com');

// describe("PaperBadger", function () {

//   // route: /
//   it("GET / fetches welcome page", function (done) {
//     request(app)
//       .get('/')
//       .expect('Content-Type', /html/)
//       .expect(200, done);
//   });

//   // route: /badges
//   it("GET /badges returns list of badges", function (done) {
//     var badgesJson = [];

//     scope.get('/systems/badgekit/badges?archived=any')
//       .reply(200, badgesJson);

//     request(app)
//       .get('/badges')
//       .expect('Content-Type', /json/)
//       .expect({})
//       .expect(200, done);
//   });

// });
