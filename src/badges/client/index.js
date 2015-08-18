var ApiClient = require('badgekit-api-client');

module.exports = function (config) {
  var auth = {
    key: config.get('BADGES_KEY'),
    secret: config.get('BADGES_SECRET')
  };

  return new ApiClient(config.get('BADGES_ENDPOINT'), auth);
};
