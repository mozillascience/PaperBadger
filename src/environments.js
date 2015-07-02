module.exports = (function() {
  var habitat = require( "habitat" );
  habitat.load('.env');
  habitat.load('default.env');
  return new habitat();
}());
