/**
 * Parse URL for path, query and hash
 *
 * @param {string} p path to parse
 * @returns {object} path, query, hash
 * @private
 */
export function parsePath(p) {
  let path = p;
  let hash = '';
  let query = '';

  const hashIndex = path.indexOf('#');

  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  const queryIndex = path.indexOf('?');

  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path,
    query,
    hash,
  };
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
  return path.replace(`${origin}/`, '');
}
