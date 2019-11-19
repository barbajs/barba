/**
 * @module typings/core
 */

import { IRouteResolved } from '@barba/router/src/defs/router';
import { IUrlFull } from '.';

export type SchemaAttributeValues =
  | 'prefix'
  | 'wrapper'
  | 'container'
  | 'prevent'
  | 'history'
  | 'namespace';

/**
 * ### Define HTML `data-attribute` used by Barba.
 *
 * @param prefix data-__prefix__
 * @param wrapper data-prefix="__wrapper__"
 * @param container data-prefix="__container__"
 * @param prevent data-prefix-__prevent__
 * @param history data-prefix-__history__
 * @param namespace data-prefix-__namespace__
 */
export interface ISchemaAttribute {
  prefix?: string;
  wrapper?: string;
  container?: string;
  prevent?: string;
  history?: string;
  namespace?: string;
}

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

export interface ISchemaPage {
  container: HTMLElement | undefined;
  html: string | undefined;
  namespace: string | undefined;
  url: IUrlFull;
  route?: IRouteResolved | null;
}
