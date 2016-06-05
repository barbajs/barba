global.Barba = require('../src/index.js?');

var context = require.context('.', true, /-test\.js$/);
context.keys().forEach(context);
