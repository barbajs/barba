"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _runAsync = _interopRequireDefault(require("run-async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  doAppear: function doAppear(transition, data) {
    if (!transition) {
      return new Error('No transition found');
    }

    var t = transition;
    var before = t.beforeAppear ? t.beforeAppear : function () {
      return Promise.resolve();
    };
    var after = t.afterAppear ? t.afterAppear : function () {
      return Promise.resolve();
    };
    return (0, _runAsync.default)(before)(data) // Questions:
    // - define what should be passed to hooks…
    // - define events to trigger
    .then(function () {
      for (var _len = arguments.length, beforeData = new Array(_len), _key = 0; _key < _len; _key++) {
        beforeData[_key] = arguments[_key];
      }

      return (0, _runAsync.default)(t.appear).apply(void 0, [data].concat(beforeData));
    }).then(function () {
      return (0, _runAsync.default)(after).apply(void 0, arguments);
    }).then(function () {
      return true;
    }) // TODO: handle error
    // eslint-disable-next-line no-unused-vars, arrow-body-style
    .catch(function (err) {
      // DEV
      // console.info('ERR', err);
      return false;
    });
  },
  // eslint-disable-next-line no-unused-vars
  doTransition: function doTransition(transition, data) {// Check data for next
    // Check mode transition
    // If no content/html or out-in mode, fetch
    // console.info(t, data);
  }
};
exports.default = _default;