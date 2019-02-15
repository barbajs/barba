/**
 * Parse URL for path, query and hash
 *
 * @param {string} p path to parse
 * @returns {object} path, query, hash
 * @private
 */
export function parsePath(p) {
  let path = p;
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
 * Clean URL remove "origin" and leading slash
 *
 * @param {string} path location.href
 * @param {string} origin location.origin
 * @returns {string} cleaned URL
 * @private
 */
export function cleanUrl(path, origin) {
  return path.replace(origin, '');
}
