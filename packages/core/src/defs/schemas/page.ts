/**
 * @module typings/core
 */
import { UrlFull } from '../shared';

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
