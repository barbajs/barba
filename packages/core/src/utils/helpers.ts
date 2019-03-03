/**
 * @module core/utils/helpers
 */
import { SchemaPage } from '../defs/schemas';
// ---
import { dom } from './dom';

type GetPage = (
  page: Promise<string | void>,
  next: SchemaPage
) => Promise<void>;

export const getPage: GetPage = async (page, next) => {
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
