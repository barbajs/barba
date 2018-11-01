"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  data: {},
  set: function set(key, val) {
    this.data[key] = val;
  },
  get: function get(key) {
    return this.data[key];
  },
  reset: function reset() {
    this.data = {};
  }
};
exports.default = _default;