'use strict';

var ApiClient = require('badgr-client');

module.exports = function (config) {
  var auth = {
    username: config.get('BADGR_USER'),
    password: config.get('BADGR_PASSWORD')
  };

  return new ApiClient(config.get('BADGR_ENDPOINT'), auth);
};
