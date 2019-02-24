export { default as pathToRegexp } from 'path-to-regexp';
export const getHref = () => window.location.href;
export const getOrigin = () => window.location.origin;
export const getPort = p => {
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
export const getPath = url => parse(url).path;
// DEV: unused
// export const getQuery = url => parse(url).query;
// export const getHash = url => parse(url).hash;

/**
 * Parse URL for path, query and hash
 *
 * @param {string} url path to parse
 * @returns {object} path, query, hash
 * @private
 */
export function parse(url) {
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
}

/**
 * Parse a query string
 *
 * @export
 * @param {string} str query string to parse
 * @returns {Array} of key/value
 * @private
 */
export function parseQuery(str) {
  return str.split('&').reduce((acc, el) => {
    const [key, value] = el.split('=');

    acc[key] = value;

    return acc;
  }, {});
}

/**
 * Clean URL, remove "origin"
 *
 * @param {string} url location.href
 * @param {string} [origin=getOrigin()] location.origin
 * @returns {string} cleaned URL
 * @private
 */
export function clean(url, origin = getOrigin()) {
  return url.replace(origin, '');
}
