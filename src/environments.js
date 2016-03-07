'use strict';

module.exports = (function () {
  var Habitat = require('habitat');
  Habitat.load('.env');
  Habitat.load('default.env');
  return new Habitat();
})();
