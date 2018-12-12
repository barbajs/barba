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
 * @property {string} wrapper - The wrapper
 * @property {string} container - The container
 * @property {string} prefetch - The prefetch
 * @property {string} prevent - The prevent
 * @property {string} namespace - The namespace
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
