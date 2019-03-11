/**
 * @barba/core/utils/dom
 * <br><br>
 * ## Dom utils
 *
 * - Access DOM contents
 * - DOM vs string conversions
 *
 * @module core/utils/dom
 * @preferred
 */

/***/

// Definitions
import { SchemaAttribute, Scope, Wrapper } from '../defs';
// Schemas
import { schemaAttribute } from '../schemas/attribute';

export class Dom {
  private _attr: SchemaAttribute = schemaAttribute;
  private _parser: DOMParser = new DOMParser();

  /**
   * Convert HTMLDocument to string.
   */
  toString(dom: HTMLElement): string {
    return dom.outerHTML;
  }

  /**
   * Parse HTML string to HTMLDocument.
   */
  toDocument(htmlString: string): HTMLDocument {
    return this._parser.parseFromString(htmlString, 'text/html');
  }

  /**
   * Get HTML content.
   */
  getHtml(doc: HTMLDocument = document): string {
    return this.toString(doc.documentElement);
  }

  /**
   * Get full document content.
   */
  // getDocument(el = document.documentElement) {
  //   return this.toStr(el);
  // },

  /**
   * Get `[data-barba="wrapper"]`.
   */
  getWrapper(scope: Scope = document): Wrapper {
    return scope.querySelector(
      `[${this._attr.prefix}="${this._attr.wrapper}"]`
    );
  }

  /**
   * Get `[data-barba="container"]`.
   */
  getContainer(scope: Scope = document): HTMLElement | null {
    return scope.querySelector(
      `[${this._attr.prefix}="${this._attr.container}"]`
    );
  }

  /**
   * Get `[data-barba-namespace]`.
   */
  getNamespace(scope: Scope = document): string | null {
    const ns = scope.querySelector(
      `[${this._attr.prefix}-${this._attr.namespace}]`
    );

    return ns
      ? ns.getAttribute(`${this._attr.prefix}-${this._attr.namespace}`)
      : null;
  }

  /**
   * Get URL from `href` value.
   */
  getUrl(el: HTMLLinkElement): string | null {
    return el.getAttribute && el.getAttribute('href') ? el.href : null;
  }
}

const dom = new Dom();

export { dom };
