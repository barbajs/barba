"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.router = void 0;

var _package = require("../package.json");

var router = {
  version: _package.version,
  routes: {},
  install: function install(barba) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    console.info('INSTALL', opts);
    this.barba = barba;
    this.routes = opts.routes || {}; // Add property to "pageSchema" (current, next)

    barba.pageSchema.route = undefined; // Register hooks

    barba.hooks.go(this.onGo, this);
  },
  init: function init() {
    console.info('INIT');
    this.barba.transitions.add('rule', {
      position: 1,
      value: {
        name: 'route',
        type: 'strings'
      }
    });
    this.barba.current.route = this.resolve(this.barba.current.url);
  },
  destroy: function destroy() {
    this.routes = {};
  },
  resolve: function resolve(url) {
    return "matching route for [".concat(url, "]");
  },
  // Hooks
  onGo: function onGo(data) {
    console.info('GO');
    data.current.route = this.resolve(data.current.url);
    data.next.route = this.resolve(data.next.url);
  }
};
exports.router = router;
var _default = router;
exports.default = _default;