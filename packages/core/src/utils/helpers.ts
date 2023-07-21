/**
 * @barba/core/utils/helpers
 * <br><br>
 * ## Helpers
 *
 * - Update next page data
 *
 * @module core/utils/helpers
 * @preferred
 */

/***/

// Third-party
import { pathToRegexp as ptr } from 'path-to-regexp';
// Definitions
import { IResponse, ITransitionData } from '../defs';
// Utils
import { dom } from './dom';
import { history } from './history';

/**
 * Update `data.next`, the title and the history
 */
export const update = async (
  page: Promise<IResponse | void>,
  data: ITransitionData
): Promise<void> => {
  // If not already updated
  if (!data.next.html) {
    const response = await page;
    const { next } = data;

    if (response) {
      // see: https://github.com/barbajs/barba/issues/362
      // const nextDocument = dom.toDocument(html);
      const nextDocument = dom.toElement(response.html);

      next.namespace = dom.getNamespace(nextDocument);
      next.container = dom.getContainer(nextDocument);
      // see https://github.com/barbajs/barba/issues/362
      // next.html = dom.getHtml(nextDocument);
      // next.html = nextDocument.innerHTML;
      next.url = response.url;
      next.html = response.html;

      // Update history namespace (not available when initially set)
      history.update({ ns: next.namespace });

      // Update title.
      const { title } = dom.toDocument(response.html);

      document.title = title;
    }
  }
};

/**
 * Next tick
 */
export const nextTick = () =>
  new Promise(resolve => {
    window.requestAnimationFrame(resolve);
    // DEV: same result?
    // setTimeout(resolve, 0);
  });

/**
 * Turn a route string such as `/user/:name` into a regular expression.
 *
 * Used for:
 *
 * - routes to ignore
 * - route transition resolution
 *
 * @see https://www.npmjs.com/package/path-to-regexp
 */
const pathToRegexp = ptr;

export { pathToRegexp };
