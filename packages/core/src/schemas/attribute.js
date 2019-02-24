/**
 * HTML Data attributes
 *
 * [data-barba]
 * [data-barba="wrapper"]
 * [data-barba="container"]
 * [data-barba="prevent"]
 * [data-barba-namespace]
 *
 * @module core/schemas/attribute
 */
/**
 * @typedef module:core/schemas/attribute.attributeSchema
 * @type {object}
 * @property {string} prefix    - The prefix
 * @property {string} wrapper   - Set the wrapper
 * @property {string} container - Set the container
 * @property {string} prevent   - Prevent link(s) of using transition
 * @property {string} namespace - Namespace for transitions and views
 */
export const attributeSchema = {
  prefix: 'data-barba',
  wrapper: 'wrapper',
  container: 'container',
  prevent: 'prevent',
  namespace: 'namespace',
};
