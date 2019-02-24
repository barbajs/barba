/**
 * DOM manipulations
 *
 * @namespace @barba/core/utils/dom
 * @type {Object}
 */
export const dom = {
  /**
   * Init
   *
   * @param {object} options options
   * @param {module:core/schemas/attribute.attributeSchema} options.attributeSchema attributeSchema
   * @returns {void}
   * @memberof @barba/core/dom
   */
  init({ attributeSchema }) {
    this.attr = attributeSchema;
    this.parser = new DOMParser();
  },

  /**
   * Convert DOM to string
   *
   * @param {HTMLElement} dom DOM stuff
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
   * @param {HTMLDocument} [doc=document] element
   * @returns {string} stringified html
   * @memberof @barba/core/dom
   */
  getHtml(doc = document) {
    return this.toString(doc.documentElement);
  },

  /**
   * Get full document content
   *
   * @param {HTMLElement} [el=document.body] element
   * @returns {string} stringified html
   * @memberof @barba/core/dom
   */
  // getDocument(el = document.documentElement) {
  //   return this.toString(el);
  // },

  /**
   * Get [data-barba="wrapper"]
   *
   * @param {HTMLElement|HTMLDocument} [scope=document] element
   * @returns {Element|null} wrapper
   * @memberof @barba/core/dom
   */
  getWrapper(scope = document) {
    return scope.querySelector(`[${this.attr.prefix}="${this.attr.wrapper}"]`);
  },

  /**
   * Get [data-barba="container"]
   *
   * @param {HTMLElement|HTMLDocument} [scope=document] element
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
   * @param {HTMLElement|Document} [scope=document] element
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

  /**
   * Get URL from href value
   *
   * @param {HTMLLinkElement} el element
   * @returns {string|undefined} href value
   * @memberof @barba/core/dom
   */
  getUrl: el =>
    el.getAttribute && el.getAttribute('href') ? el.href : undefined,
};
