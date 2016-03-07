'use strict';

var app = require('./app');
var env = require('./environments');
var client = require('./badges/client')(env);
var service = require('./badges/service');

function init() {
  service.init(client, env);
  app.listen(env.get('PORT'), function () {
    console.log('PaperBadger started on port: ', env.get('PORT'));
  });
}

init();
