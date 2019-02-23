import { version } from '../package.json';
import { requestIdleCallback } from './polyfills';

// TODO: use array
const toPrefetch = new Set();

/**
 * Barba prefetch
 *
 * @namespace @barba/prefetch
 * @type {object}
 */
export const prefetch = {
  /**
   * Version
   *
   * @memberof @barba/prefetch
   * @type {string}
   */
  version,

  /**
   * Plugin installation
   *
   * @memberof @barba/prefetch
   * @param {barba} barba barba instance
   * @param {HTMLElement} [root = document.body] root element
   * @param {number} [timeout = 2e3] timeout before observing
   * @returns {undefined}
   */
  install(barba, { root = document.body, timeout = 2e3 } = {}) {
    this.barba = barba;
    this._root = root;
    this._timeout = timeout;
    this._logger = new this.barba.Logger('@barba/prefetch');
  },

  /**
   * Plugin initialisation
   *
   * @memberof @barba/prefetch
   * @returns {undefined}
   */
  init() {
    if (!this.barba.usePrefetch) {
      this._logger.warn('barba.usePrefetch is disabled');

      return;
    }
    if (!this.barba.useCache) {
      this._logger.warn('barba.useCache is disabled');

      return;
    }

    /**
     * Init intersection observer
     * when intersecting, it will check if URL should be prefetched
     * then unobserve the element
     * and, if no cache data, fetch the page
     */
    /* istanbul ignore next */
    this._observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const url = this.barba.utils.getHref(el);

          if (toPrefetch.has(url)) {
            this._observer.unobserve(el);
            // Prefetch and cache
            if (!this.barba.cache.has(url)) {
              this.barba.cache.set(
                url,
                this.barba.request(
                  url,
                  this.barba._timeout,
                  this._onRequestError.bind(this, 'prefetch')
                )
              );
            }
          }
        }
      });
    });
    this._observe(this._timeout);
    // Register hooks
    this.barba.hooks.after(this._observe, this);
  },

  /**
   * Plugin reset
   *
   * @memberof @barba/prefetch
   * @returns {undefined}
   */
  // DEV
  // destroy() {},

  /* istanbul ignore next */
  _observe(timeout) {
    requestIdleCallback(
      () => {
        // If not, find all links and use IntersectionObserver.
        this._root.querySelectorAll('a').forEach(el => {
          const url = this.barba.utils.getHref(el);

          // Add some [data-barba="preload"] or
          // Add some [data-barba-preload="true/false"] ?
          if (
            !this.barba.cache.has(url) &&
            !this.barba.prevent.check(el, {}, el.href)
          ) {
            this._observer.observe(el);
            toPrefetch.add(url);
          }
        });
      },
      { timeout }
    );
  },
};

export default prefetch;
