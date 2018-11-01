"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _default = {
  available: ['go', 'beforeAppear', 'appear', 'afterAppear', 'beforeEnter', 'enter', 'afterEnter', 'beforeLeave', 'leave', 'afterLeave'],
  registered: {},

  /**
   * Init available hooks
   *
   * A hook is a function that receive:
   * - function to execute
   * - optional context
   * @returns {hooks} this instance
   */
  init: function init() {
    var _this = this;

    this.available.forEach(function (hook) {
      _this[hook] = function (fn) {
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        _this.registered[hook] = _this.registered[hook] || [];

        _this.registered[hook].push({
          fn: fn,
          ctx: ctx
        });
      };
    });
    return this;
  },

  /**
   * Clean registered hooks
   *
   * @returns {hooks} this instance
   */
  destroy: function destroy() {
    this.registered = {};
    return this;
  },

  /**
   * Do hook
   *
   * @param {string} hook hook name
   * @param {...*} args arguments to be passed to the hook function
   * @returns {undefined}
   */
  do: function _do(hook) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (hook in this.registered === false) {
      return;
    }

    this.registered[hook].forEach(function (hook) {
      return hook.fn.apply(hook.ctx, args);
    });
  },

  /**
   * Help, print available and registered hooks
   *
   * @returns {undefined}
   */
  help: function help() {
    console.log("Available hooks: ".concat(this.available));
    console.log("Registered hooks: ".concat((0, _utils.map)(this.registered, function (hook) {
      return hook.name;
    })));
  }
};
exports.default = _default;