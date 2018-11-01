"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var prevent = {
  tests: {},
  add: function add(id, check) {
    // #TODO: check for existing test
    this.tests[id] = check;
  },
  check: function check(el, event, href) {
    var _this = this;

    return Object.keys(this.tests).some(function (id) {
      return _this.tests[id]({
        el: el,
        event: event,
        href: href
      });
    });
  }
};
/**
 * Prevent tests
 *
 * If check is true, barba is not actionated.
 * Test receives { el, event, href }
 */
// Make sure the browser supports pushstate

prevent.add('pushState', function () {
  return !window.history.pushState;
}); // Make sure there is an el and href

prevent.add('exists', function (_ref) {
  var el = _ref.el,
      href = _ref.href;
  return !el || !href;
}); // If the user is pressing ctrl + click the browser will open a new tab

prevent.add('newTab', function (_ref2) {
  var event = _ref2.event;
  return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}); // Blank target

prevent.add('blank', function (_ref3) {
  var el = _ref3.el;
  return el.hasAttribute('target') && el.target === '_blank';
}); // Check if the domain is the same (in order to avoid pushState cross origin security problem)

prevent.add('corsDomain', function (_ref4) {
  var el = _ref4.el;
  return window.location.protocol !== el.protocol || window.location.hostname !== el.hostname;
}); // Check the port

prevent.add('corsPort', function (_ref5) {
  var el = _ref5.el;
  return (0, _utils.getPort)() !== (0, _utils.getPort)(el.port);
}); // Check download attribute

prevent.add('download', function (_ref6) {
  var el = _ref6.el;
  return el.getAttribute && typeof el.getAttribute('download') === 'string';
}); // Check same url

prevent.add('sameUrl', function (_ref7) {
  var href = _ref7.href;
  return (0, _utils.cleanLink)(href) === (0, _utils.cleanLink)(window.location.href);
}); // If contains no-barba class

prevent.add('noBarba', function (_ref8) {
  var el = _ref8.el;
  return el.classList.contains('no-barba');
});
var _default = prevent;
exports.default = _default;