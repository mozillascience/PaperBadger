var startApp = require('./startApp');

var startAppCallback = function (app) {
  console.log(app.name + ' started on ' + app.port);
};

startApp(startAppCallback);
