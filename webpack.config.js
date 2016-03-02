'use strict';

var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: {
    'angular-ahdin': './angular-ahdin',
    'angular-ahdin.min': './angular-ahdin'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ahdin'
  },
  resolve: {
    alias: {
      'load-image$': 'blueimp-load-image/js/load-image.all.min.js',
      'load-image-exif$': 'blueimp-load-image/js/load-image.all.min.js',
      'load-image-meta$': 'blueimp-load-image/js/load-image.all.min.js'
    }
  },
  externals: {
    'angular': 'angular',
    'blob-util': {
      amd: 'blob-util',
      commonjs: 'blob-util',
      commonjs2: 'blob-util',
      root: 'blobUtil'
    },
    'blueimp-load-image/js/load-image.all.min': {
      amd: 'blueimp-load-image/js/load-image.all.min',
      commonjs: 'blueimp-load-image/js/load-image.all.min',
      commonjs2: 'blueimp-load-image/js/load-image.all.min',
      root: 'loadImage'
    }
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      include: /\.min\.js$/,
      minimize: true
    }),
    new CleanWebpackPlugin(['dist'])
  ]
};
