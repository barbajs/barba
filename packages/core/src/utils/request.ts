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
import { IResponse, RequestError } from '../defs';
import { Cache } from '@barba/core/src/modules/Cache';
import { Headers } from '@barba/core/src/modules/Headers';
import { parse } from './url';

/**
 * Init a page request.
 * Fetch the page and returns a promise with the text content.
 */
function request(
  url: string,
  ttl: number = 2e3,
  requestError: RequestError,
  cache: Cache,
  headers: Headers
): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve({
            url: {
              href: xhr.responseURL,
              ...parse(xhr.responseURL)
            },
            html: xhr.responseText
          });

          cache.update(url, {
            status: 'fulfilled',
            target: xhr.responseURL
          });
        } else if (xhr.status) {
          // HTTP code is not 200, reject with response.
          const response = {
            status: xhr.status,
            statusText: xhr.statusText,
          };

          requestError(xhr.responseURL, response);
          reject(response);

          cache.update(xhr.responseURL, { status: 'rejected' });
        }
      }
    };

    xhr.ontimeout = () => {
      const error = new Error(`Timeout error [${ttl}]`);
      requestError(xhr.responseURL, error);
      reject(error);
      cache.update(xhr.responseURL, { status: 'rejected' });
    };

    xhr.onerror = () => {
      const error = new Error(`Fetch error`);
      requestError(xhr.responseURL, error);
      reject(error);
      cache.update(xhr.responseURL, { status: 'rejected' });
    };

    xhr.open('GET', url);
    xhr.timeout = ttl;
    xhr.setRequestHeader(
      'Accept',
      'text/html,application/xhtml+xml,application/xml'
    );
    xhr.setRequestHeader('x-barba', 'yes');

    headers.all().forEach((value, key) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send();
  });
}

export { request };
