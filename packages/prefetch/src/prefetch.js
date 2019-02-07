import { version } from '../package.json';
import './polyfills';

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
   * @param {HTMLElement} [root = document.body] routes
   * @returns {undefined}
   */
  install(barba, { root = document.body, timeout = 2e3 } = {}) {
    this.barba = barba;
    this._root = root;
    this._timeout = timeout;
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
              this.barba.cache.set(url, this.barba.request(url));
            }
          }
        }
      });
    });
  },

  /**
   * Plugin initialisation
   *
   * @memberof @barba/prefetch
   * @returns {undefined}
   */
  init() {
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

  _observe(timeout) {
    /* istanbul ignore next */
    window.requestIdleCallback(
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
