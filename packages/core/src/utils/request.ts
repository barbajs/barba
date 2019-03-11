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

/**
 * Timeout wrapper.
 */
function timeout(
  url: string,
  ms: number,
  request: Promise<string>,
  requestError: RequestError
): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      const error = new Error('Timeout error');

      requestError(url, error);
      reject(error);
    }, ms);

    request
      .then(
        response => {
          window.clearTimeout(timeoutId);
          resolve(response);
        },
        errorOrResponse => {
          window.clearTimeout(timeoutId);
          requestError(url, errorOrResponse);
          reject(errorOrResponse);
        }
      )
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */
          reject(error);
        }
      );
  });
}

/**
 * Fetch the page and returns the text content.
 */
async function fetcher(url: string): Promise<string> {
  const headers = new Headers({
    'x-barba': 'yes',
  });

  try {
    const response = await self.fetch(url, {
      method: 'GET',
      headers,
      cache: 'default',
    });

    if (response.status >= 200 && response.status < 300) {
      return response.text();
    }

    throw response;
  } catch (error) {
    throw error;
  }
}

/**
 * Init a page request.
 */
function request(
  url: string,
  ttl: number = 2e3,
  requestError: RequestError | boolean
): Promise<string> {
  return timeout(url, ttl, fetcher(url), requestError as RequestError);
}

export { request };
