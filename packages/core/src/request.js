const requestTimeout = 2e3;

/**
 * Timeout wrapper
 *
 * @param {string} url url fetched
 * @param {number} ms milliseconds
 * @param {promise} request request async function
 * @param {function} requestError request error callback
 * @returns {promise} async function resolution
 * @private
 */
function timeout(url, ms, request, requestError) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      const error = new Error('Timeout error');

      requestError(url, error);
      reject(error);
    }, ms);

    request.then(
      res => {
        window.clearTimeout(timeoutId);
        resolve(res);
      },
      errorOrResponse => {
        window.clearTimeout(timeoutId);
        requestError(url, errorOrResponse);
        reject(errorOrResponse);
      }
    );
  });
}

/**
 * Fetch content
 *
 * @param {string} url url to fetch
 * @returns {Promise} text content or error
 * @private
 */
async function request(url) {
  const conn = navigator.connection;

  /* istanbul ignore else */
  if (conn) {
    // Don't prefetch if the user is on 2G or if Save-Data is enabled...
    // http://wicg.github.io/netinfo/#effectivetype-attribute
    // http://wicg.github.io/netinfo/#savedata-attribute
    /* istanbul ignore else */
    if (
      (conn.effectiveType && conn.effectiveType.match(/2g/)) ||
      conn.saveData
    ) {
      return Promise.reject(
        new Error('Bad connection or reduced data usage mode')
      );
    }
  }

  const headers = new Headers({
    'x-barba': 'yes',
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'default',
    });

    if (response.status >= 200 && response.status < 300) {
      // DEV: should return DOM directly ?
      return response.text();
    }

    throw response;
  } catch (error) {
    throw error;
  }
}

export default (url, ttl = requestTimeout, requestError) =>
  timeout(url, ttl, request(url), requestError);
