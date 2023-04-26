/**
 * @barba/core/utils/request
 * <br><br>
 * ## Fetch pages for transitions.
 *
 * - Includes timeout
 * - Uses Fetch API
 * - Handles errors
 *
 * @module core/utils/request
 * @preferred
 */

/***/

// Definitions
import { RequestError } from '../defs';
import { Cache } from '@barba/core/src/modules/Cache';

/**
 * Init a page request.
 * Fetch the page and returns a promise with the text content.
 */
function request(
  url: string,
  ttl: number = 2e3,
  requestError: RequestError,
  cache: Cache
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else if (xhr.status) {
          // HTTP code is not 200, reject with response.
          const res = {
            status: xhr.status,
            statusText: xhr.statusText,
          };
          requestError(url, res);
          reject(res);
        }
      }
    };
    xhr.ontimeout = () => {
      const err = new Error(`Timeout error [${ttl}]`);
      requestError(url, err);
      reject(err);
    };
    xhr.onerror = () => {
      const err = new Error(`Fetch error`);
      requestError(url, err);
      reject(err);
    };

    xhr.open('GET', url);
    xhr.timeout = ttl;
    xhr.setRequestHeader(
      'Accept',
      'text/html,application/xhtml+xml,application/xml'
    );
    xhr.setRequestHeader('x-barba', 'yes');
    xhr.send();
  });
}

export { request };
