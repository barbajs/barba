/**
 * @module core/schemas
 */
import { SchemaPage } from '../defs/schemas';

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
export const schemaPage: SchemaPage = {
  container: undefined,
  html: undefined,
  namespace: undefined,
  url: {
    href: undefined,
    path: undefined,
    hash: undefined,
    query: {},
  },
};
