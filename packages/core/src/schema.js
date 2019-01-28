/**
 * Attributes
 * data-barba
 *    ="wrapper"
 *    ="container"
 *    ="prefetch"
 *    ="prevent"
 * data-barba-namespace
 *
 * @property {string} prefix - The prefix
 * @property {string} wrapper - Set the wrapper
 * @property {string} container - Set the container
 * @property {string} prefetch - Prefetch (to be discussed)
 * @property {string} prevent - Prevent link(s) of using transition
 * @property {string} namespace - Namespace for transitions and views
 * @private
 */
// TODO: prefetch or noprefetch or no-prefetch?
export const attributeSchema = {
  prefix: 'data-barba',
  wrapper: 'wrapper',
  container: 'container',
  prefetch: 'prefetch',
  prevent: 'prevent',
  namespace: 'namespace',
};

/**
 * Pages (current and next structure)
 *
 * @property {string} namespace - The namespace
 * @property {string} url - The URL
 * @property {string} container - The container
 * @property {string} html - The HTML
 * @private
 */
export const pageSchema = {
  namespace: undefined,
  url: undefined,
  container: undefined,
  html: undefined,
};
