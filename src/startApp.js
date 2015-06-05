var Habitat = require('habitat')
// load env from .env
Habitat.load();

// expose everything to `env`
var env = new Habitat();

module.exports = function (startAppCallback) {
  var app = require('./app')(env);
  app.listen(env.get('PORT'), startAppCallback({
    name: 'PaperBadger',
    port: env.get('PORT')
  }));
};
