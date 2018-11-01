"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  init: function init(attributes) {
    this.attr = attributes;
  },
  getNamespace: function getNamespace() {
    var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    var ns = scope.querySelector("[".concat(this.attr.prefix, "-").concat(this.attr.namespace, "]"));
    return ns ? ns.getAttribute("".concat(this.attr.prefix, "-").concat(this.attr.namespace)) : null;
  },
  getWrapper: function getWrapper() {
    var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    return scope.querySelector("[".concat(this.attr.prefix, "=\"").concat(this.attr.wrapper, "\"]"));
  },
  getContainer: function getContainer() {
    var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    return scope.querySelector("[".concat(this.attr.prefix, "=\"").concat(this.attr.container, "\"]"));
  },
  getHtml: function getHtml() {
    var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    return el.parentNode.innerHTML;
  }
};
exports.default = _default;