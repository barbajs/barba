/**
 * @module core/utils/url
 */
import { UrlBase, GenericObject } from '../defs/shared';
// ---

/**
 * Convert path to regexp
 */
export { default as pathToRegexp } from 'path-to-regexp';

/**
 * Get location href
 */
export const getHref = (): string => window.location.href;

/**
 * Get location origin
 */
export const getOrigin = (): string => window.location.origin;

/**
 * Get port based on location
 */
export const getPort = (p?: string) => {
  const port = p || window.location.port;
  const { protocol } = window.location;

  if (port !== '') {
    return parseInt(port, 10);
  }

  if (protocol === 'https:') {
    return 443;
  }

  return 80;
};

/**
 * Get path from URL
 */
export const getPath = (url: string): string => parse(url).path;

/**
 * Get query object from URL
 */
// export const getQuery = (url: string): GenericObject => parse(url).query;

/**
 * Get hash from URL
 */
// export const getHash = (url: string): string => parse(url).hash;

/**
 * Parse URL for path, query and hash
 */
export const parse = (url: string): UrlBase => {
  let path = clean(url);
  let hash = undefined;
  let query = {};

  const hashIndex = path.indexOf('#');

  if (hashIndex >= 0) {
    hash = path.slice(hashIndex + 1);
    path = path.slice(0, hashIndex);
  }

  const queryIndex = path.indexOf('?');

  if (queryIndex >= 0) {
    query = parseQuery(path.slice(queryIndex + 1));
    path = path.slice(0, queryIndex);
  }

  return {
    path,
    query,
    hash,
  };
};

/**
 * Parse a query string to object
 */
export const parseQuery = (str: string) =>
  str.split('&').reduce((acc: GenericObject, el: string) => {
    const [key, value] = el.split('=');

    acc[key] = value;

    return acc;
  }, {});

/**
 * Clean URL, remove "origin"
 */
export const clean = (url: string, origin = getOrigin()) =>
  url.replace(origin, '');
