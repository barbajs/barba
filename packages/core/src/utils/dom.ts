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
import { ISchemaAttribute, Scope, Wrapper } from '../defs';
// Schemas
import { schemaAttribute } from '../schemas/attribute';

export class Dom {
  private _attr: ISchemaAttribute = schemaAttribute;
  private _parser: DOMParser = new DOMParser();

  /**
   * Convert HTMLDocument to string.
   */
  public toString(el: HTMLElement): string {
    return el.outerHTML;
  }

  /**
   * Parse HTML string to HTMLDocument.
   */
  // see https://github.com/barbajs/barba/issues/362
  // Seems that using DOMParser.parseFromString causes this issue.
  public toDocument(htmlString: string): HTMLDocument {
    return this._parser.parseFromString(htmlString, 'text/html');
  }

  /**
   * Parse HTML string to DIVElement.
   *
   * DOMParser.parseFromString fails with img[srcset] on iOS.
   * see https://github.com/barbajs/barba/issues/362
   */
  public toElement(htmlString: string): HTMLDivElement {
    const div = document.createElement('div');

    div.innerHTML = htmlString;
    return div;
  }

  /**
   * Get HTML content.
   */
  public getHtml(doc: HTMLDocument = document): string {
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
  public getWrapper(scope: Scope = document): Wrapper {
    return scope.querySelector(
      `[${this._attr.prefix}="${this._attr.wrapper}"]`
    );
  }

  /**
   * Get `[data-barba="container"]`.
   */
  public getContainer(scope: Scope = document): HTMLElement | null {
    return scope.querySelector(
      `[${this._attr.prefix}="${this._attr.container}"]`
    );
  }

  /**
   * Get `[data-barba-namespace]`.
   */
  public getNamespace(scope: Scope = document): string | null {
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
  public getHref(el: HTMLLinkElement): string | null {
    return el.getAttribute && el.getAttribute('href') ? el.href : null;
  }
}

const dom = new Dom();

export { dom };
