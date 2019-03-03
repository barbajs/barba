/**
 * @module core/utils/request
 */
import { Request, RequestTimeout, RequestFetcher } from '../defs/utils';
import { RequestError } from '../defs/shared';
// ---

/**
 * Timeout wrapper
 *
 */
const timeout: RequestTimeout = (url, ms, request, requestError) => {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      const error = new Error('Timeout error');

      requestError(url, error);
      reject(error);
    }, ms);

    request.then(
      response => {
        window.clearTimeout(timeoutId);
        resolve(response);
      },
      errorOrResponse => {
        window.clearTimeout(timeoutId);
        requestError(url, errorOrResponse);
        reject(errorOrResponse);
      }
    );
  });
};

/**
 * Fetch content
 */
const fetcher: RequestFetcher = async url => {
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
      // DEV: should return DOM directly ?
      return response.text();
    }

    throw response;
  } catch (error) {
    throw error;
  }
};

const request: Request = (url, ttl = 2e3, requestError) =>
  timeout(url, ttl, fetcher(url), requestError as RequestError);

export { request };
