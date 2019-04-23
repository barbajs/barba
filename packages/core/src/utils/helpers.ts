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
      // see: https://github.com/barbajs/barba/issues/362
      // const nextDocument = dom.toDocument(html);
      const nextDocument = dom.toElement(html);

      next.namespace = dom.getNamespace(nextDocument);
      next.container = dom.getContainer(nextDocument);
      // see https://github.com/barbajs/barba/issues/362
      // next.html = dom.getHtml(nextDocument);
      // next.html = nextDocument.innerHTML;
      next.html = html;

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
