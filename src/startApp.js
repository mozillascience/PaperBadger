module.exports = function (startAppCallback) {
	var env = require('./environments');

  var app = require('./app')();
  app.listen(env.get('PORT'), startAppCallback({
    name: 'PaperBadger',
    port: env.get('PORT')
  }));
};
