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
import { ISchemaPage } from '../defs/schemas';
// Utils
import { dom } from './dom';

/**
 * Update `data.next`.
 */
export const updateNext = async (
  page: Promise<string | void>,
  next: ISchemaPage
): Promise<void> => {
  if (!next.html) {
    const html = await page;

    if (html) {
      const nextDocument = dom.toDocument(html);

      next.namespace = dom.getNamespace(nextDocument);
      next.container = dom.getContainer(nextDocument);
      next.html = dom.getHtml(nextDocument);
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
