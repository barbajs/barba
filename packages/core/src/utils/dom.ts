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
import { IDomSibling, ISchemaAttribute, Link, Scope, Wrapper } from '../defs';
// Schemas
import { schemaAttribute } from '../schemas/attribute';

export class Dom {
  private _attr: ISchemaAttribute = schemaAttribute;
  private _parser: DOMParser;
  private _sibling: IDomSibling = {
    after: null,
    before: null,
    parent: null
  };

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
    /* istanbul ignore else */
    if (!this._parser) {
      this._parser = new DOMParser();
    }
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
      this._updateSibling(container);
      container.parentNode.removeChild(container);
    }
  }

  /**
   * Add container near previous container
   */
  public addContainer(container: HTMLElement, wrapper: HTMLElement) {
    const siblingBefore = this.getContainer() || this._sibling.before;

    if (siblingBefore) {
      this._insertAfter(container, siblingBefore);
    } else if (this._sibling.after) {
      this._sibling.after.parentNode.insertBefore(container, this._sibling.after);
    } else if (this._sibling.parent) {
      this._sibling.parent.appendChild(container);
    } else {
      wrapper.appendChild(container);
    }
  }

  /**
   * Get current dom sibling
   */
  public getSibling(): IDomSibling {
    return this._sibling;
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

        return this.resolveUrl(attr);
      }
    }
    return null;
  }

  // Copyright 2014 Simon Lydell
  // X11 (“MIT”) Licensed. (See LICENSE
  // https://github.com/lydell/resolve-url/blob/master/resolve-url.js
  /* istanbul ignore next */
  public resolveUrl(...urls: string[]) {
    const numUrls = urls.length;

    if (numUrls === 0) {
      throw new Error('resolveUrl requires at least one argument; got none.');
    }

    const base = document.createElement('base');
    base.href = arguments[0];

    if (numUrls === 1) {
      return base.href;
    }

    const head = document.getElementsByTagName('head')[0];
    head.insertBefore(base, head.firstChild);

    const a = document.createElement('a');
    let resolved;

    for (let index = 1; index < numUrls; index++) {
      a.href = arguments[index];
      resolved = a.href;
      base.href = resolved;
    }

    head.removeChild(base);

    return resolved;
  }

  /**
   * Insert node after another node.
   */
  private _insertAfter(newNode: Node, referenceNode: Node) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  /**
   * Update current dom sibling regarding container
   */
  private _updateSibling(container: HTMLElement): IDomSibling {
    this._sibling = {
      after: container.nextElementSibling,
      before: container.previousElementSibling,
      parent: container.parentElement
    };

    return this._sibling;
  }
}

const dom = new Dom();

export { dom };
