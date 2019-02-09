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
      error => {
        window.clearTimeout(timeoutId);
        requestError(url, error);
        reject(error);
      }
    );
  });
}

/**
 * Fetch content
 *
 * @param {string} url url to fetch
 * @returns {string} text content
 * @private
 */
async function request(url) {
  const headers = new Headers({
    'x-barba': 'yes',
  });

  try {
    const result = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'default',
    });

    if (result.status >= 200 && result.status < 300) {
      // DEV: should return DOM directly ?
      return await result.text();
    }

    throw new Error(result.statusText || result.status);
  } catch (error) {
    throw error;
  }
}

export default (url, ttl = requestTimeout, requestError) =>
  timeout(url, ttl, request(url), requestError);
