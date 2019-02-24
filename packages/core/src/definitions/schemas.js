/**
 * Schemas
 *
 * @namespace @barba/definitions/schema
 */
/**
 * HTML Data attributes
 *
 * [data-barba]
 * [data-barba="wrapper"]
 * [data-barba="container"]
 * [data-barba="prevent"]
 * [data-barba-namespace]
 *
 * @memberof @barba/definitions/schema
 * @typedef {object} attributeSchema
 * @property {string} prefix    - The prefix
 * @property {string} wrapper   - Set the wrapper
 * @property {string} container - Set the container
 * @property {string} prevent   - Prevent link(s) of using transition
 * @property {string} namespace - Namespace for transitions and views
 */

/**
 * Structured data for "current" and "next" pages
 *
 * @memberof @barba/definitions/schema
 * @typedef {object} pageSchema
 * @property {string} container - The container ([data-barba="container"])
 * @property {string} html      - The HTML
 * @property {string} namespace - The namespace ([data-barba-namespace])
 * @property {object} url       - URL related data
 * @property {string} url.href  - The full URL
 * @property {string} url.path  - The path, without location, hash nor query
 * @property {string} url.hash  - The hash, everything after '#'
 * @property {object} url.query - The query string ({key: value})
 */

export default {};
