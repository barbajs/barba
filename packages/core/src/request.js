const requestTimeout = 5000;

/**
 * Timeout wrapper
 *
 * @param {number} ms milliseconds
 * @param {promise} promise async function
 * @returns {promise} async function resolution
 */
function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('Timeout error'));
    }, ms);

    promise.then(
      res => {
        window.clearTimeout(timeoutId);
        resolve(res);
      },
      err => {
        window.clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

/**
 * Fetch content
 *
 * @param {string} url url to fetch
 * @returns {string} text content
 */
async function request(url) {
  const headers = new Headers({
    'x-barba': 'yes',
  });

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'default',
    });

    if (res.status >= 200 && res.status < 300) {
      // DEV: should return DOM directly ?
      return await res.text();
    }

    throw new Error(res.statusText || res.status);
  } catch (error) {
    throw error;
  }
}

export default url => timeout(requestTimeout, request(url));
