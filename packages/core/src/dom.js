export default {
  /**
   * Init dom
   *
   * @param {object} { attributeSchema } options
   * @returns {undefined}
   */
  init({ attributeSchema }) {
    this.attr = attributeSchema;
  },

  /**
   * Get element + html
   *
   * @param {HTMLElement} [el=document.body] element
   * @returns {string} html
   */
  getHtml(el = document.body) {
    return el.parentNode.innerHTML;
  },

  /**
   * Get element's wrapper
   *
   * @param {HTMLElement} [scope=document] element
   * @returns {HTMLElement|null} wrapper
   */
  getWrapper(scope = document) {
    return scope.querySelector(`[${this.attr.prefix}="${this.attr.wrapper}"]`);
  },

  /**
   * Get element's container
   *
   * @param {HTMLElement} [scope=document] element
   * @returns {HTMLElement|null} container
   */
  getContainer(scope = document) {
    return scope.querySelector(
      `[${this.attr.prefix}="${this.attr.container}"]`
    );
  },

  /**
   * Get namespace
   *
   * @param {HTMLElement} [scope=document] element
   * @returns {string|null} namespace
   */
  getNamespace(scope = document) {
    const ns = scope.querySelector(
      `[${this.attr.prefix}-${this.attr.namespace}]`
    );

    return ns
      ? ns.getAttribute(`${this.attr.prefix}-${this.attr.namespace}`)
      : null;
  },
};
