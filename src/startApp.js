module.exports = function (startAppCallback) {
  var Habitat = require('habitat');
  Habitat.load('.env');
  Habitat.load('env.dist');

  var env = new Habitat();
  var badgeClient = require('./badgeClient.js')(env);
  var badgeService = require('./badgeService.js')(badgeClient, env);

  var app = require('./app')(badgeService);
  app.listen(env.get('PORT'), startAppCallback({
    name: 'PaperBadger',
    port: env.get('PORT')
  }));
};
