/**
 * Attributes
 * data-barba
 *    ="wrapper"
 *    ="container"
 *    ="prefetch"
 *    ="prevent"
 * data-barba-namespace
 *
 * @type {object}
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
 * @type {object}
 */
export const pageSchema = {
  namespace: undefined,
  url: undefined,
  container: undefined,
  html: undefined,
};
