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
import { ISchemaAttribute, Link, Scope, Wrapper } from '../defs';
// Schemas
import { schemaAttribute } from '../schemas/attribute';

export class Dom {
  private _attr: ISchemaAttribute = schemaAttribute;
  private _parser: DOMParser = new DOMParser();
  private _sibling: HTMLElement = null;

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
   * Remove container and store next sibling (if applicable).
   */
  public removeContainer(container: HTMLElement) {
    if (document.body.contains(container)) {
      this._sibling = container.nextElementSibling as HTMLElement;
      container.parentNode.removeChild(container);
    }
  }

  /**
   * Add container before next sibling or at the end of the wrapper.
   */
  public addContainer(container: HTMLElement, wrapper: HTMLElement) {
    if (this._sibling) {
      wrapper.insertBefore(container, this._sibling);
    } else {
      wrapper.appendChild(container);
    }
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
  public getHref(el: Link): string | null {
    // HTML tagName is UPPERCASE, xhtml tagName keeps existing case.
    if (el.tagName && el.tagName.toLowerCase() === 'a') {
      const href = el.getAttribute('href');

      if (href) {
        // When link comes from SVG, `href` returns an object, not a string.
        return ((href as unknown) as SVGAnimatedString).baseVal || href;
      }
    }
    return null;
  }
}

const dom = new Dom();

export { dom };
