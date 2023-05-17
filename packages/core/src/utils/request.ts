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
          cache.update(url, { status: 'fulfilled' });
          resolve({
            url: {
              href: xhr.responseURL,
              ...parse(xhr.responseURL)
            },
            html: xhr.responseText
          });

        } else if (xhr.status) {
          // HTTP code is not 200, reject with response.
          const res = {
            status: xhr.status,
            statusText: xhr.statusText,
          };
          requestError(url, res);
          reject(res);
          cache.update(url, { status: 'rejected' });
        }
      }
    };
    xhr.ontimeout = () => {
      const err = new Error(`Timeout error [${ttl}]`);
      requestError(url, err);
      reject(err);
      cache.update(url, { status: 'rejected' });
    };
    xhr.onerror = () => {
      const err = new Error(`Fetch error`);
      requestError(url, err);
      reject(err);
      cache.update(url, { status: 'rejected' });
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
