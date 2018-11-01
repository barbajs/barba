"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  events: {},
  on: function on(e, f) {
    this.events[e] = this.events[e] || [];
    this.events[e].push(f);
  },
  once: function once(e, f) {
    var _this = this;

    var newf = function newf() {
      _this.off(e, newf);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      f.apply(_this, args);
    };

    this.on(e, newf);
  },
  off: function off(e, f) {
    if (e in this.events === false) {
      return;
    }

    this.events[e].splice(this.events[e].indexOf(f), 1);
  },
  trigger: function trigger(e) {
    var _this2 = this;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (e in this.events === false) {
      return;
    }

    this.events[e].forEach(function (event) {
      event.apply(_this2, args);
    });
  }
};
exports.default = _default;