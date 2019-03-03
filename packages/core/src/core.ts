/**
 * This comment will be used to document the "thing2" module.
 * Not working, @see https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/300
 *
 * @module core
 */

import { Core } from './defs/core';
import { SchemaPage } from './defs/schemas';
import {
  BarbaOptions,
  BarbaPlugin,
  Trigger,
  Wrapper,
  RequestCustomError,
} from './defs/shared';
// ---
import { version } from '../package.json';
import { schemaPage } from './schemas';
import {
  cache,
  history,
  hooks,
  store,
  transitions as transitionsManager,
  views as viewsManager,
} from './modules';
import { dom, request, helpers, prevent, url, Logger } from './utils';

/** @ignore */ let _current: SchemaPage;
/** @ignore */ let _next: SchemaPage;
/** @ignore */ let _trigger: Trigger;
/** @ignore */ let _requestCustomError: RequestCustomError;
/** @ignore */ let _wrapper: Wrapper;
/** @ignore */ const _plugins: BarbaPlugin<any>[] = [];
/** @ignore */ const _logger: Logger = new Logger('@barba/core');

/**
 * Barba core object.
 *
 * Main methods:
 *
 * - `.init()` for initialization with options
 * - `.use()` for plugins
 */
const core: Core = {
  /**
   * barba/core version.
   */
  version,

  /**
   * Logger.
   */
  Logger,

  /**
   * Inital values.
   */

  // Public from options
  /** @ignore */ timeout: 2e3,
  /** @ignore */ useCache: true,
  /** @ignore */ usePrefetch: true,
  // Schemas.
  /** @ignore */ schemaPage, // Page schema.
  // Modules.
  cache,
  history,
  hooks: hooks.init(),
  store,
  transitionsManager,
  viewsManager,
  // Utils.
  dom,
  helpers,
  prevent,
  request,
  url,

  /**
   * ### Init plugin with options.
   *
   * See [[BarbaPlugin]] for more details.
   */
  use(plugin, options) {
    const installedPlugins = _plugins;

    // Plugin installation
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    if (typeof plugin.install === 'function') {
      plugin.install(this, options);
    } else {
      return false;
    }

    installedPlugins.push(plugin);

    return this;
  },

  /**
   * ### Init barba with options.
   *
   * See [[BarbaOptions]] for more details.
   */
  init(
    /** @ignore */ {
      transitions = [],
      views = [],
      prevent: preventCustom = null,
      timeout = 2e3,
      requestError = undefined,
      // TODO: refactor options + behaviour
      // cacheIgnore
      // prefetchIgnore (merged or overridden with @barba/prefetch)
      useCache = true,
      usePrefetch = true,
      debug = false,
      logLevel = 'debug',
    }: BarbaOptions = {}
  ) {
    // 0. Set logger level
    Logger.setLevel(debug === true ? 'debug' : logLevel);

    // 1. Manage options
    _requestCustomError = requestError;
    this.timeout = timeout;
    this.useCache = useCache;
    this.usePrefetch = usePrefetch;

    // Add prevent custom
    if (preventCustom !== null) {
      if (typeof preventCustom !== 'function') {
        throw new Error('[@barba/core] Prevent should be a function');
      }

      this.prevent.add('preventCustom', preventCustom);
    }

    // 2. Get and check wrapper
    _wrapper = this.dom.getWrapper();
    if (!_wrapper) {
      throw new Error('[@barba/core] No Barba wrapper found');
    }
    _wrapper.setAttribute('aria-live', 'polite'); // A11y

    // 3. Init pages (get "current" data)
    this._refreshPages();
    if (!_current.container) {
      throw new Error('[@barba/core] No Barba container found');
    }

    // 4. Init other modules
    this.store.init(transitions);
    this.viewsManager.init(views);

    // 5. Use "current" data
    // Set/update history
    this.history.add(_current.url.href, _current.namespace);
    // Add to cache
    this.useCache &&
      this.cache.set(_current.url.href, Promise.resolve(_current.html));

    // 6. Bind context
    this.onRequestError = this.onRequestError.bind(this);
    this._onLinkEnter = this._onLinkEnter.bind(this);
    this._onLinkClick = this._onLinkClick.bind(this);
    this._onStateChange = this._onStateChange.bind(this);
    this._bind();

    // 7. Init plugins
    _plugins.forEach(plugin => plugin.init());

    // 8. Finally, do appear…
    this.appear();
  },

  /**
   * ### Force a page change without Barba transition.
   *
   * Check for a "href" attribute.
   * Then check if eligible for Barba.
   *
   * @private
   * @ignore
   */
  force(url) {
    // DEV
    // Can be used waiting animation cancellation management…
    window.location.assign(url);
  },

  /**
   * ### Start an "appear" transition.
   *
   * If some registered "appear" transition,
   * get the "resolved" transition from the store and start it.
   */
  async appear() {
    // Check if appear transition
    if (this.store.hasAppear) {
      try {
        const data = this._getData();
        const transition = this.store.get(data, true);

        await this.transitionsManager.doAppear({ transition, data });
      } catch (error) {
        _logger.error(error);
      }
    }
  },

  /**
   * ### Start a "page" transition.
   *
   * 1. If no running transition, updates data with full URL properties and trigger.
   * 2. Get page form cache or init request.
   * 3. Wait if some transitions need "next" data (`sync: true`, `to: …`).
   * 4. Manage the history, depending on trigger.
   * 5. Get "data" and trigger "go" hook.
   * 6. Get the "resolved" transition from the store and start it.
   * 7. Update title and refresh data (current, next = undefined)
   */
  async go(url, trigger = 'barba') {
    // If animation running, force reload
    if (this.transitionsManager.running) {
      this.force(url);

      return;
    }

    _next.url = {
      href: url,
      ...this.url.parse(url),
    };
    _trigger = trigger;

    let page;

    if (this.useCache) {
      /* eslint-disable indent */
      page = this.cache.has(url)
        ? this.cache.get(url)
        : this.cache
            .set(
              url,
              this.request(
                url,
                this.timeout,
                this.onRequestError.bind(this, trigger, 'click')
              )
            )
            .get(url);
      /* eslint-enable indent */
    } else {
      page = this.request(
        url,
        this.timeout,
        this.onRequestError.bind(this, trigger, 'click')
      );
    }

    // Need to wait before getting the right transition
    if (this.store.wait) {
      await helpers.getPage(page, _next);
    }

    // If triggered from an history change (back, forward),
    // simply add the new state without
    if (trigger === 'popstate') {
      history.add(url, _next.namespace);
    } else {
      history.push(url, _next.namespace);
    }

    const data = this._getData();

    // Hook: between trigger and transition
    // Can be used to resolve "route"…
    hooks.do('go', data);

    try {
      const transition = this.store.get(data);

      await this.transitionsManager.doPage({
        transition,
        data,
        page,
        wrapper: _wrapper,
      });

      this._updateTitle(data);
      this._refreshPages();
    } catch (error) {
      // TODO: !!! infinite loop on transition error???
      history.cancel();
      _logger.error(error);
    }
  },

  /**
   * Get Barba wrapper
   *
   * @private
   * @ignore
   */
  get wrapper() {
    return _wrapper;
  },

  /**
   * Bind event listeners.
   *
   * @private
   * @ignore
   */
  _bind() {
    /* istanbul ignore else */
    if (this.usePrefetch) {
      document.addEventListener('mouseover', this._onLinkEnter);
      document.addEventListener('touchstart', this._onLinkEnter);
    }
    document.addEventListener('click', this._onLinkClick);
    window.addEventListener('popstate', this._onStateChange);
  },

  /**
   * When a element is entered.
   *
   * Get valid link element.
   * Cache URL if needed.
   *
   * @private
   * @ignore
   */
  _onLinkEnter(e) {
    const link = this._getLinkElement(e);

    if (!link) {
      return;
    }

    const url = this.dom.getUrl(link);

    // Already in cache
    if (this.cache.has(url)) {
      return;
    }

    this.cache.set(
      url,
      this.request(url, this.timeout, this.onRequestError(link, 'enter')).catch(
        error => _logger.error(error)
      )
    );
  },

  /**
   * When an element is clicked.
   *
   * Get valid link element.
   * Prevent same URL.
   * Go for a Barba transition.
   *
   * @private
   * @ignore
   */
  _onLinkClick(e) {
    const link = this._getLinkElement(e);

    if (!link) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    // Check prevent sameURL
    if (this.prevent.run('sameUrl', link, e, link.href)) {
      // Same URL -> force reload
      this.force(link.href);

      return;
    }

    this.go(this.dom.getUrl(link), link);
  },

  /**
   * When History state changes.
   *
   * Get "href" from URL
   * Go for a Barba transition.
   *
   * @private
   * @ignore
   */
  _onStateChange() {
    const href = this.url.getHref();

    this.go(href, 'popstate');
  },

  /**
   * When a request error occurs.
   *
   * Allow the user to manage request error. (E.g: 404)
   *
   * @private
   * @ignore
   */
  onRequestError(trigger, action, ...args) {
    const [url, response] = args;

    this.cache.delete(url);

    // Custom requestError returning false will return here.
    if (
      _requestCustomError &&
      _requestCustomError(trigger, action, url, response) === false
    ) {
      return false;
    }

    // Force page change
    if (action === 'click') {
      this.force(url);
    }
    return false;
  },

  /**
   * Get a valid link ancestor.
   *
   * Check for a "href" attribute.
   * Then check if eligible for Barba.
   *
   * @private
   * @ignore
   */
  _getLinkElement(e) {
    let el = e.target as HTMLLinkElement;

    while (el && !this.dom.getUrl(el)) {
      el = (el as HTMLElement).parentNode as HTMLLinkElement;
    }

    // Check prevent
    if (!el || this.prevent.check(el, e, el.href)) {
      return;
    }

    return el;
  },

  /**
   * Get pages data.
   *
   * Returns accurate information about current, next and trigger.
   *
   * @private
   * @ignore
   */
  _getData() {
    return {
      current: _current,
      next: _next,
      trigger: _trigger,
    };
  },

  /**
   * Refresh pages data.
   *
   * Set "current" and unset "next".
   *
   * @private
   * @ignore
   */
  _refreshPages() {
    _current = { ...this.schemaPage };
    _next = { ...this.schemaPage };

    const href = this.url.getHref();

    _current.namespace = this.dom.getNamespace();
    _current.url = {
      href,
      ...this.url.parse(href),
    };
    _current.container = this.dom.getContainer();
    _current.html = this.dom.getHtml();

    // Hook: reset current/next pages
    // Can be used to resolve "route"…
    // TODO: naming…
    hooks.do('refresh', this._getData());
  },

  /**
   * Update document title.
   *
   * @private
   * @ignore
   */
  _updateTitle(data) {
    const { html } = data.next;
    const { title } = this.dom.toDocument(html);

    document.title = title;
  },
};

export default core;
