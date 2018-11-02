// TODO: handle SVG or other special cases.

export const getHref = el => el.href;
export const getUrl = () => window.location.href;
export const cleanLink = url => url.replace(/#.*/, '');
export const getPort = p => {
  const port = typeof p === 'undefined' ? window.location.port : p;
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
 * ForEach for array/object (basic version)
 *
 * @param {Array|Object} collection "collection" to loop over
 * @param {Function} iteratee callback
 * @returns {Array|Object} initial collection
 */
export function forEach(collection, iteratee) {
  if (collection.forEach === undefined) {
    Object.keys(collection).forEach(key => {
      iteratee(collection[key], key);
    });
  } else {
    collection.forEach(iteratee);
  }

  return collection;
}

/**
 * Map for array/object (basic version)
 *
 * @param {Array|Object} collection "collection" to loop over
 * @param {Function} iteratee callback
 * @returns {Array} "mapped" array
 */
export function map(collection, iteratee) {
  if (collection.map === undefined) {
    return Object.keys(collection).map(key => iteratee(collection[key], key));
  }

  return collection.map(iteratee);
}
