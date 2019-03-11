/**
 * @module typings/core
 */

// Definitions
import { GenericObject } from '.';

export interface UrlBase {
  path: string | undefined;
  hash: string | undefined;
  query: GenericObject;
}
export interface UrlFull extends UrlBase {
  href: string | undefined;
}
