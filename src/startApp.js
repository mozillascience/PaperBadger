require('dotenv').load();

module.exports = function (startAppCallback) {
  var config = process.env;
  var app = require('./app')(config);
  app.listen(config.PORT, startAppCallback({
    name: 'PaperBadger',
    port: config.PORT
  }));
};
