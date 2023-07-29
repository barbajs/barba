/**
 * @barba/prefetch
 * <br><br>
 * ## Barba prefetch.
 *
 * @module prefetch
 * @preferred
 */

import { IPrefetchOptions } from './defs';

/***/

// Definitions
import { Core } from '@barba/core/src/core';
import { IBarbaPlugin, Link } from '@barba/core/src/defs';
import { Logger } from '@barba/core/src/modules/Logger';

import { version } from '../package.json';
import { requestIdleCallback } from './polyfills';

class Prefetch implements IBarbaPlugin<IPrefetchOptions> {
  public name = '@barba/prefetch';
  public version = version;
  public barba: Core;
  public logger: Logger;

  public observer: IntersectionObserver;
  public root: HTMLElement | HTMLDocument;
  public timeout: number;
  public limit: number;
  public toPrefetch: Set<string> = new Set();

  /**
   * Plugin installation.
   */
  public install(
    barba: Core,
    { root = document.body, timeout = 2e3, limit = 0 }: IPrefetchOptions = {}
  ) {
    this.logger = new barba.Logger(this.name);
    this.logger.info(this.version);
    this.barba = barba;
    this.root = root;
    this.timeout = timeout;
    this.limit = limit;
  }

  /**
   * Plugin initialisation.
   */
  public init() {
    if (this.barba.prefetchIgnore) {
      this.logger.warn('barba.prefetchIgnore is enabled');

      return;
    }
    if (this.barba.cacheIgnore) {
      this.logger.warn('barba.cacheIgnore is enabled');

      return;
    }

    /**
     * Init intersection observer
     * when intersecting, it will check if URL should be prefetched
     * then unobserve the element
     * and, if no cache data, fetch the page
     */
    /* istanbul ignore next */
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        const link = entry.target as Link;
        const href = this.barba.url.getAbsoluteHref(this.barba.dom.getHref(link));

        if (!this.toPrefetch.has(href)) {
          return;
        }

        this.observer.unobserve(link);

        // Prefetch and cache
        if (!this.barba.cache.has(href)) {
          this.barba.cache.set(
            href,
            this.barba
              .request(
                href,
                this.barba.timeout,
                this.barba['onRequestError'].bind(this.barba, 'barba'), // tslint:disable-line:no-string-literal
                this.barba.cache,
                this.barba.headers
              )
              .catch(error => {
                this.logger.error(error);
              }),
            'prefetch',
            'pending'
          );
        } else {
          this.barba.cache.update(href, { action: 'prefetch' });
        }
      });
    });
    this.observe();

    // Register hooks
    this.barba.hooks.after(this.observe, this);
  }

  /* istanbul ignore next */
  public observe(): void {
    const timeout = this.timeout;

    requestIdleCallback(
      () => {
        let links = Array.from(this.root.querySelectorAll('a'));

        if (this.limit > 0) {
          links = links.slice(0, this.limit);
        }

        // If not, find all links and use IntersectionObserver.
        links.forEach(el => {
          const link = (el as unknown) as Link;
          const href = this.barba.dom.getHref(link);

          if (
            !this.barba.cache.has(href) &&
            !this.barba.prevent.checkHref(href) &&
            !this.barba.prevent.checkLink(link, {} as Event, href)
          ) {
            this.observer.observe(el);
            this.toPrefetch.add(href);
          }
        });
      },
      { timeout }
    );
  }
}

const prefetch = new Prefetch();

export default prefetch;
