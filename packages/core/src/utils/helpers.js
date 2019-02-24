import { dom } from './dom';

export const getPage = (page, next) => {
  if (next.html) {
    return Promise.resolve();
  }

  return page.then(html => {
    const nextDocument = dom.toDocument(html);

    next.namespace = dom.getNamespace(nextDocument);
    next.container = dom.getContainer(nextDocument);
    next.html = dom.getHtml(nextDocument);
  });
};
