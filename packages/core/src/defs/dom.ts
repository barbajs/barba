/**
 * @module typings/core
 */

export type Link = HTMLAnchorElement | SVGAElement;
export type LinkEvent = MouseEvent | TouchEvent;
export type Scope = HTMLElement | HTMLDocument;
export type Trigger = Link | 'popstate' | 'barba';
export type Wrapper = HTMLElement | null;
