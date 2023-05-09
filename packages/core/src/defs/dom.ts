/**
 * @module typings/core
 */

export type Link = HTMLAnchorElement | SVGAElement;
export type LinkEvent = MouseEvent | TouchEvent;
export type Scope = HTMLElement | HTMLDocument;
export type Trigger = Link | 'barba' | 'popstate' | 'back' | 'forward';
export type Wrapper = HTMLElement | null;

export interface IDomSibling {
  before?: Element;
  after?: Element;
  parent?: Element;
}
