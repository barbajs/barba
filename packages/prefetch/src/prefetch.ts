/**
 * @module prefetch
 */
import { BarbaPlugin } from '@barba/core/src/defs/shared';
import { Core } from '@barba/core/src/defs/core';
import { Logger } from '@barba/core/src/utils/Logger';

import { version } from '../package.json';
import { requestIdleCallback } from './polyfills';
/**
 * Barba prefetch.
 * @preferred
 */

type PrefetchOptions = {
  root?: HTMLElement | HTMLDocument;
  timeout?: number;
};

interface Prefetch<T> extends BarbaPlugin<T> {
  version: string;
  install(barba: Core, options: T): void;
  init(): void;
  // _observe(timeout: number): void;
}

let _barba: Core;
let _logger: Logger;
let _observer: IntersectionObserver;
let _root: HTMLElement | HTMLDocument;
let _timeout: number;
const _toPrefetch: Set<string> = new Set();

function _observe(timeout: number): void {
  requestIdleCallback(
    () => {
      // If not, find all links and use IntersectionObserver.
      _root.querySelectorAll('a').forEach(el => {
        const link = (el as unknown) as HTMLLinkElement;
        const url = _barba.dom.getUrl(link);

        // Add some [data-barba="preload"] or
        // Add some [data-barba-preload="true/false"] ?
        if (
          !_barba.cache.has(url) &&
          !_barba.prevent.check(link, {} as Event, link.href)
        ) {
          _observer.observe(el);
          _toPrefetch.add(url);
        }
      });
    },
    { timeout }
  );
}

const prefetch: Prefetch<PrefetchOptions> = {
  version,

  /**
   * Plugin installation
   */
  install(
    barba,
    { root = document.body, timeout = 2e3 }: PrefetchOptions = {}
  ) {
    _barba = barba;
    _logger = new barba.Logger('@barba/prefetch');
    _root = root;
    _timeout = timeout;
  },

  /**
   * Plugin initialisation
   */
  init() {
    if (!_barba.usePrefetch) {
      _logger.warn('barba.usePrefetch is disabled');

      return;
    }
    if (!_barba.useCache) {
      _logger.warn('barba.useCache is disabled');

      return;
    }

    /**
     * Init intersection observer
     * when intersecting, it will check if URL should be prefetched
     * then unobserve the element
     * and, if no cache data, fetch the page
     */
    /* istanbul ignore next */
    _observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLLinkElement;
          const url = _barba.dom.getUrl(link);

          if (_toPrefetch.has(url)) {
            _observer.unobserve(link);
            // Prefetch and cache
            if (!_barba.cache.has(url)) {
              _barba.cache.set(
                url,
                _barba.request(
                  url,
                  _barba.timeout,
                  _barba.onRequestError.bind(this, 'prefetch')
                )
              );
            }
          }
        }
      });
    });
    _observe(_timeout);
    // Register hooks
    _barba.hooks.after(_observe);
  },

  /**
   * Observers initialisation
   *
   * @ignore
   */
  /* istanbul ignore next */
  // _observe(timeout: number): void {
  //   requestIdleCallback(
  //     () => {
  //       // If not, find all links and use IntersectionObserver.
  //       _root.querySelectorAll('a').forEach(el => {
  //         const link = (el as unknown) as HTMLLinkElement;
  //         const url = _barba.dom.getUrl(link);

  //         // Add some [data-barba="preload"] or
  //         // Add some [data-barba-preload="true/false"] ?
  //         if (
  //           !_barba.cache.has(url) &&
  //           !_barba.prevent.check(link, {} as Event, link.href)
  //         ) {
  //           _observer.observe(el);
  //           _toPrefetch.add(url);
  //         }
  //       });
  //     },
  //     { timeout }
  //   );
  // },
};

export default prefetch;
