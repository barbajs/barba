/**
 * @module core/utils/dom
 */
import { SchemaAttribute } from '../defs/schemas';
import { Dom } from '../defs/utils';
// ---
import { schemaAttribute } from '../schemas';

const _attr: SchemaAttribute = schemaAttribute;
const _parser: DOMParser = new DOMParser();

/**
 * DOM manipulations
 */
const dom: Dom = {
  /**
   * Convert DOM to string
   */
  toString(dom) {
    return dom.outerHTML;
  },

  /**
   * Parse HTML string to HTMLDocument
   */
  toDocument(htmlString) {
    return _parser.parseFromString(htmlString, 'text/html');
  },

  /**
   * Get html content
   */
  getHtml(doc = document) {
    return this.toString(doc.documentElement);
  },

  /**
   * Get full document content
   */
  // getDocument(el = document.documentElement) {
  //   return this.toStr(el);
  // },

  /**
   * Get [data-barba="wrapper"]
   */
  getWrapper(scope = document) {
    return scope.querySelector(`[${_attr.prefix}="${_attr.wrapper}"]`);
  },

  /**
   * Get [data-barba="container"]
   */
  getContainer(scope = document) {
    return scope.querySelector(`[${_attr.prefix}="${_attr.container}"]`);
  },

  /**
   * Get [data-barba-namespace]
   */
  getNamespace(scope = document) {
    const ns = scope.querySelector(`[${_attr.prefix}-${_attr.namespace}]`);

    return ns ? ns.getAttribute(`${_attr.prefix}-${_attr.namespace}`) : null;
  },

  /**
   * Get URL from href value
   */
  getUrl(el) {
    return el.getAttribute && el.getAttribute('href') ? el.href : null;
  },
};

export { dom };
