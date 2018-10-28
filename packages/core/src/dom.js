export default {
  init(schema) {
    this.schema = schema;
  },
  getNamespace(scope = document) {
    const ns = scope.querySelector(
      `[${this.schema.prefix}-${this.schema.namespace}]`
    );

    return ns
      ? ns.getAttribute(`${this.schema.prefix}-${this.schema.namespace}`)
      : null;
  },
  getWrapper(scope = document) {
    return scope.querySelector(
      `[${this.schema.prefix}="${this.schema.wrapper}"]`
    );
  },
  getContainer(scope = document) {
    return scope.querySelector(
      `[${this.schema.prefix}="${this.schema.container}"]`
    );
  },
  getHtml(el = document.body) {
    return el.parentNode.innerHTML;
  },
};
