export default {
  init(attributes) {
    this.attr = attributes;
  },
  getNamespace(scope = document) {
    const ns = scope.querySelector(
      `[${this.attr.prefix}-${this.attr.namespace}]`
    );

    return ns
      ? ns.getAttribute(`${this.attr.prefix}-${this.attr.namespace}`)
      : null;
  },
  getWrapper(scope = document) {
    return scope.querySelector(`[${this.attr.prefix}="${this.attr.wrapper}"]`);
  },
  getContainer(scope = document) {
    return scope.querySelector(
      `[${this.attr.prefix}="${this.attr.container}"]`
    );
  },
  getHtml(el = document.body) {
    return el.parentNode.innerHTML;
  },
};
