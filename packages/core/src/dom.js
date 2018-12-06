export default {
  /**
   * Init dom
   *
   * @param {object} { attributeSchema } options
   * @returns {undefined}
   */
  init({ attributeSchema }) {
    this.attr = attributeSchema;
    this.parser = new DOMParser();
  },

  toString(dom) {
    return dom.outerHTML;
  },

  toDocument(html) {
    return this.parser.parseFromString(html, 'text/html');
  },

  /**
   * Get html content
   *
   * @param {HTMLElement} [el=document.documentElement] element
   * @returns {string} html
   */
  getHtml(el = document) {
    return this.toString(el.documentElement);
    // DEV
    // return el.parentNode.innerHTML;
  },

  /**
   * Get full document ???
   *
   * @param {HTMLElement} [el=document.body] element
   * @returns {string} html
   */
  getDocument(el = document.documentElement) {
    return this.toString(el);
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
