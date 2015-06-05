module.exports = function (startAppCallback) {
  var Habitat = require('habitat');
  Habitat.load('.env');
  Habitat.load('env.dist');

  var env = new Habitat();

  var app = require('./app')();
  app.listen(env.get('PORT'), startAppCallback({
    name: 'PaperBadger',
    port: env.get('PORT')
  }));
};
