/**
 * DOM manipulations
 *
 * @namespace @barba/core/dom
 * @type {object}
 */
export default {
  /**
   * Init
   *
   * @param {object} { attributeSchema } options
   * @returns {undefined}
   * @memberof @barba/core/dom
   */
  init({ attributeSchema }) {
    this.attr = attributeSchema;
    this.parser = new DOMParser();
  },

  /**
   * Convert DOM to string
   *
   * @param {HTMLDocument|HTMLElement} dom DOM stuff
   * @returns {string} stringified result
   * @memberof @barba/core/dom
   */
  toString(dom) {
    return dom.outerHTML;
  },

  /**
   * Parse HTML string to HTMLDocument
   *
   * @param {string} htmlString to be parsed
   * @returns {HTMLDocument} parsed result
   * @memberof @barba/core/dom
   */
  toDocument(htmlString) {
    return this.parser.parseFromString(htmlString, 'text/html');
  },

  /**
   * Get html content
   *
   * @param {HTMLElement} [el=document] element
   * @returns {string} stringified html
   * @memberof @barba/core/dom
   */
  getHtml(el = document) {
    return this.toString(el.documentElement);
  },

  /**
   * Get full document content
   *
   * @param {HTMLElement} [el=document.body] element
   * @returns {string} stringified html
   * @memberof @barba/core/dom
   */
  // TODO: useless?
  getDocument(el = document.documentElement) {
    return this.toString(el);
  },

  /**
   * Get [data-barba="wrapper"]
   *
   * @param {HTMLElement} [scope=document] element
   * @returns {HTMLElement|null} wrapper
   * @memberof @barba/core/dom
   */
  getWrapper(scope = document) {
    return scope.querySelector(`[${this.attr.prefix}="${this.attr.wrapper}"]`);
  },

  /**
   * Get [data-barba="container"]
   *
   * @param {HTMLElement} [scope=document] element
   * @returns {HTMLElement|null} container
   * @memberof @barba/core/dom
   */
  getContainer(scope = document) {
    return scope.querySelector(
      `[${this.attr.prefix}="${this.attr.container}"]`
    );
  },

  /**
   * Get [data-barba-namespace]
   *
   * @param {HTMLElement} [scope=document] element
   * @returns {string|null} namespace
   * @memberof @barba/core/dom
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
