var ApiClient = require('badgekit-api-client');

module.exports = function (config) {
  var auth = {
    key: config.BADGES_KEY,
    secret: config.BADGES_SECRET
  };

  return new ApiClient(config.BADGES_ENDPOINT, auth);
}
