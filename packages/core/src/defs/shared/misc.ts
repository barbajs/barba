/**
 * @module typings/core
 */
// Generic
export type GenericObject = {
  [key: string]: string;
};
// DOM
export type LinkEvent = MouseEvent | TouchEvent;
export type Scope = HTMLElement | HTMLDocument;
export type Trigger = HTMLLinkElement | 'popstate' | 'barba' | 'prefetch';
export type Wrapper = HTMLElement | null;
// URLs
export interface UrlBase {
  path: string | undefined;
  hash: string | undefined;
  query: GenericObject;
}
export interface UrlFull extends UrlBase {
  href: string | undefined;
}
