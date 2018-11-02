/**
 * Attributes
 * data-barba
 *    ="wrapper"
 *    ="container"
 *    ="prefetch"
 *    ="prevent"
 * data-barba-namespace
 */
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
 */
export const pageSchema = {
  namespace: undefined,
  url: undefined,
  container: undefined,
  html: undefined,
};
