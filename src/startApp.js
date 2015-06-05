module.exports = function (startAppCallback) {
  var habitat = require('habitat');
  habitat.load('.env');
  habitat.load('env.dist');

  var env = new habitat();

  var app = require('./app')();
  app.listen(env.get('PORT'), startAppCallback({
    name: 'PaperBadger',
    port: env.get('PORT')
  }));
};
