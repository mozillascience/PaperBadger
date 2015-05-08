var path = require('path');

var IMPORT_ES5_SHIM = 'imports?shim=es5-shim/es5-shim&' +
  'sham=es5-shim/es5-sham';

module.exports = {
  entry: './templates/client.jsx',

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join('public', 'js'),
    publicPath: '/js/'
  },

  module: {
    loaders: [{
      test: /\.jsx$/,
      loaders: ['babel', 'jsx-loader']
    }, {
      test: require.resolve('react'),
      loader: IMPORT_ES5_SHIM
    }]
  }
};
