/**
 * @module typings/core
 */
export type PreventCheckData = {
  el: HTMLLinkElement;
  event: Event;
  href: string;
};
export type PreventCheck = (data: PreventCheckData) => {};
