'use strict';

var webpackConfig = require('./webpack.config');

delete webpackConfig.entry;
delete webpackConfig.externals;
delete webpackConfig.plugins;
webpackConfig.devtool = 'inline-source-map';

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    files: [
      'test/index.js',
      {
        pattern: 'test/*.{jpg,png}',
        watched: false,
        included: false
      }
    ],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },
    frameworks: ['jasmine'],
    singleRun: true,
    webpack: webpackConfig
  });
};
