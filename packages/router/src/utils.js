/**
 * Parse URL for path, query and hash
 *
 * @export
 * @param {string} p path to parse
 * @returns {object} path, query, hash
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
 * @export
 * @param {String} path location.href
 * @param {String} origin location.origin
 * @returns {String} cleaned URL
 */
export function cleanUrl(path, origin) {
  return path.replace(`${origin}/`, '');
}
