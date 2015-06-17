module.exports = function (startAppCallback) {
	var env = require('./environments');
  var badgeClient = require('./badgeClient.js')(env);
  var badgeService = require('./badgeService.js')(badgeClient, env);
  var app = require('./app')(badgeService);
  app.listen(env.get('PORT'), startAppCallback({
    name: 'PaperBadger',
    port: env.get('PORT')
  }));
};
