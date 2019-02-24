/**
 * Pages (current and next structure)
 *
 * @module core/schemas/page
 */
/**
 * @typedef module:core/schemas/page.pageSchema
 * @type {object}
 * @property {string} container - The container ([data-barba="container"])
 * @property {string} html      - The HTML
 * @property {string} namespace - The namespace ([data-barba-namespace])
 * @property {object} url       - URL related data
 * @property {string} url.href  - The full URL
 * @property {string} url.path  - The path, without location, hash nor query
 * @property {string} url.hash  - The hash, everything after '#'
 * @property {object} url.query - The query string ({key: value})
 */
export const pageSchema = {
  container: undefined,
  html: undefined,
  namespace: undefined,
  url: {
    href: undefined,
    path: undefined,
    hash: undefined,
    query: {},
  },
};
