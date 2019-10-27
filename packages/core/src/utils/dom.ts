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

import path from 'path';

// Definitions
import { ISchemaAttribute, Link, Scope, Wrapper } from '../defs';
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
   * Remove container and store next sibling (if applicable).
   */
  public removeContainer(container: HTMLElement) {
    if (document.body.contains(container)) {
      container.parentNode.removeChild(container);
    }
  }

  /**
   * Add container before next sibling or at the end of the wrapper.
   */
  public addContainer(container: HTMLElement, wrapper: HTMLElement) {
    const existingContainer = this.getContainer();

    if (existingContainer) {
      this._insertAfter(container, existingContainer);
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
      // HTMLAnchorElement, full URL available
      if (typeof el.href === 'string') {
        return el.href;
      }

      // Probably a SVGAElement…
      const href = el.getAttribute('href') || el.getAttribute('xlink:href');

      /* istanbul ignore else */
      if (href) {
        // When link comes from SVG, `href` returns an object, not a string.
        const attr: string =
          ((href as unknown) as SVGAnimatedString).baseVal || href;

        // If "relative" ref, we need to create a full URL…
        // Absolute, with or without protocol
        if (/^http/.test(attr)) {
          return attr;
        }
        if (/^\/\//.test(attr)) {
          return window.location.protocol + attr;
        }

        // Relative from root (/xxx)
        if (/^\//.test(attr)) {
          return window.location.origin + attr;
        }

        // Relative others (xxx, ./xxx, ../xxx)
        if (/^(\w+|\.\/|\.\.\/)/.test(attr)) {
          const base = window.location.pathname.replace(/[^\/]*$/, '');

          return window.location.origin + path.resolve(base, attr);
        }

        // Just append…
        return window.location.href + attr;
      }
    }
    return null;
  }

  /**
   * Insert node after another node.
   */
  private _insertAfter(newNode: Node, referenceNode: Node) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
}

const dom = new Dom();

export { dom };
