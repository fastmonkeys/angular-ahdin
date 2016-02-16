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
    modulesDirectories: ['node_modules', '.']
  },
  externals: {
    'angular': 'angular',
    'blob-util': 'blobUtil',
    'blueimp-load-image/js/load-image': 'loadImage',
    'blueimp-load-image/js/load-image-orientation': 'loadImage',
    'blueimp-load-image/js/load-image-meta': 'loadImage',
    'blueimp-load-image/js/load-image-exif': 'loadImage',
    'blueimp-load-image/js/load-image-exif-map': 'loadImage'
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
