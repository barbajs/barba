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

// Definitions
import { SchemaPage } from '../defs/schemas';
// Third-party
import ptr from 'path-to-regexp';
// Utils
import { dom } from './dom';

/**
 * Update `data.next`.
 */
export const updateNext = async (
  page: Promise<string | void>,
  next: SchemaPage
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
