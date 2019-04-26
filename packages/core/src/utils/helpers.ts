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
import ptr from 'path-to-regexp';
// Definitions
import { ITransitionData } from '../defs';
import { ISchemaPage } from '../defs/schemas';
// Utils
import { dom } from './dom';
import { history } from './history';

/**
 * Update `data.next`, the title and the history
 */
export const update = async (
  page: Promise<string | void>,
  data: ITransitionData
): Promise<void> => {
  // If not already updated
  if (!data.next.html) {
    const html = await page;
    const { next, trigger } = data;

    if (html) {
      // see: https://github.com/barbajs/barba/issues/362
      // const nextDocument = dom.toDocument(html);
      const nextDocument = dom.toElement(html);

      next.namespace = dom.getNamespace(nextDocument);
      next.container = dom.getContainer(nextDocument);
      // see https://github.com/barbajs/barba/issues/362
      // next.html = dom.getHtml(nextDocument);
      // next.html = nextDocument.innerHTML;
      next.html = html;

      // Update history
      // If triggered from an history change (back, forward),
      // simply add the new state without
      if (trigger === 'popstate') {
        history.add(next.url.href, next.namespace);
      } else {
        history.push(next.url.href, next.namespace);
      }

      // Update title.
      const { title } = dom.toDocument(html);

      document.title = title;
    }
  }
};

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
