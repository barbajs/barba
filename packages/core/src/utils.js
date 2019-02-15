import dom from './dom';

export const getHref = el =>
  el.getAttribute && el.getAttribute('href') ? el.href : undefined;
export const getUrl = () => window.location.href;
// TODO: check
// https://github.com/luruke/barba.js/pull/323
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

export const getPage = (page, next) => {
  if (next.html) {
    return Promise.resolve();
  }

  return page.then(html => {
    const nextDocument = dom.toDocument(html);

    next.namespace = dom.getNamespace(nextDocument);
    next.container = dom.getContainer(nextDocument);
    next.html = dom.getHtml(nextDocument);
  });
};

/**
 * ForEach for array/object (basic version)
 *
 * @param {array|object} collection "collection" to loop over
 * @param {function} iteratee callback
 * @returns {array|Object} initial collection
 * @private
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
 * @param {array|object} collection "collection" to loop over
 * @param {function} iteratee callback
 * @returns {array} "mapped" array
 * @private
 */
export function map(collection, iteratee) {
  if (collection.map === undefined) {
    return Object.keys(collection).map(key => iteratee(collection[key], key));
  }

  return collection.map(iteratee);
}
