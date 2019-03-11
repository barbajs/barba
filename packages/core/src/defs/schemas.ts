/**
 * @module typings/core
 */

import { UrlFull } from '.';

/**
 * ### Define HTML `data-attribute` used by Barba.
 *
 * @param prefix data-__prefix__
 * @param wrapper data-prefix="__wrapper__"
 * @param container data-prefix="__container__"
 * @param prevent data-prefix-__prevent__
 * @param namespace data-prefix-__namespace__
 */
export type SchemaAttribute = {
  prefix: string;
  wrapper: string;
  container: string;
  prevent: string;
  namespace: string;
};

/**
 * ### Define "page" data structure.
 *
 * Used by `data.current` and `data.next`.<br>
 * Set to `undefined` until values are available.
 *
 * @param container Barba container element
 * @param html Full stringified HTML
 * @param namespace Namespace
 * @param url URL
 * @param route Route name (with `@barba/router`)
 */

export type SchemaPage = {
  container: HTMLElement | undefined;
  html: string | undefined;
  namespace: string | undefined;
  url: UrlFull;
  route?: string;
};
