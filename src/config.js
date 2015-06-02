var fs = require('fs');

module.exports = function (env) {
  if (env === null) {
    env = {};
  }

  return function (callback) {
    fs.readFile('conf.default.json', 'utf8', function (err, contents) {
      var conf, key;

      if (err !== null) {
        return callback(err);
      }

      try {
        conf = JSON.parse(contents);
      } catch (_error) {
        return callback('Could not parse config JSON ' + _error);
      }

      // overwrite the enviroment config to the json config
      for (key in env) {
        conf[key] = env[key];
      }

      callback(null, conf);
    });
  };
};
