require('angular');
require('angular-mocks');

var testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
