var getConfig = require('./config.js')(process.env);
var app = require('./app');

module.exports = function (startAppCallback) {
  getConfig(function (error, config) {
    if (error !== null) {
      console.log('Config error :' + error);
    } else {
      var appConfigured = app(config);
      appConfigured.listen(config.PORT, startAppCallback({
        name: 'PaperBadger',
        port: config.PORT
      }));
    }
  });
};
