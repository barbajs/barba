import { version } from '../package.json';
import { attributeSchema, pageSchema } from './schema';
import { manager, store } from './transitions';
import Logger from './Logger';
import cache from './cache';
import dom from './dom';
import history from './history';
import hooks from './hooks';
import prevent from './prevent';
import request from './request';
import viewsManager from './views';
import * as utils from './utils';

import './polyfills';
import './defs';

/**
 * Barba core
 *
 * @namespace @barba/core
 * @type {object}
 */
export default {
  /**
   * Version
   *
   * @memberof @barba/core
   * @type {string}
   */
  version,

  /**
   * Logger
   *
   * @memberof @barba/core
   * @type {Logger}
   */
  logger: new Logger('@barba/core'),

  /**
   * Transitions manager
   *
   * @memberof @barba/core
   * @type {manager}
   */
  manager,

  /**
   * Transitions store
   *
   * @memberof @barba/core
   * @type {store}
   */
  store,

  /**
   * Cache
   *
   * @memberof @barba/core
   * @type {cache}
   */
  cache,

  /**
   * Hooks
   *
   * @memberof @barba/core
   * @type {hooks}
   */
  hooks: hooks.init(),

  /**
   * Prevent checker
   *
   * @memberof @barba/core
   * @type {prevent}
   */
  prevent,

  /**
   * Request (fetch) manager
   *
   * @memberof @barba/core
   * @type {request}
   */
  request,

  /**
   * Utils
   *
   * @memberof @barba/core
   * @type {object}
   */
  utils,

  /**
   * Page object structure
   *
   * @memberof @barba/core
   * @type {object}
   */
  // @type {import('./defs.js').pageSchema}
  pageSchema,

  /**
   * Plugins list
   *
   * @memberof @barba/core
   * @type {array}
   * @private
   */
  _plugins: [],

  /**
   * Use plugin
   *
   * @memberof @barba/core
   * @param {plugin} plugin - Plugin
   * @param {...any} args - Other arguments
   * @returns {this} - Current instance
   */
  use(plugin, ...args) {
    const installedPlugins = this._plugins;

    // Plugin installation
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    if (typeof plugin.install === 'function') {
      plugin.install(this, ...args);
    } else if (typeof plugin === 'function') {
      plugin(this, ...args);
    } else {
      return false;
    }

    installedPlugins.push(plugin);

    return this;
  },

  /* eslint-disable */
  // @param {import('./defs.js').transition[]} options.transitions - Transition array
  // @param {import('./defs.js').attributeSchema=} options.schema - Schema
  /* eslint-enable */
  /**
   * Init barba
   *
   * @memberof @barba/core
   * @param {object} options - Options
   * @param {transition[]} [options.transitions=[]] - Transitions array
   * @param {view[]} [options.views=[]] - Views array
   * @param {object} [options.schema=attributeSchema] - Schema
   * @param {function} [options.requestError=undefined] - Request error callback
   * @param {number} [options.timeout=5000] - Request timeout
   * @param {boolean} [options.useCache=true] - Enable cache
   * @param {boolean} [options.usePrefetch=true] - Enable prefetch
   * @param {boolean} [options.debug=false] - Debug mode
   * @param {string} [options.log='off'] - Log level
   * @returns {undefined}
   */
  init({
    transitions = [],
    views = [],
    schema = attributeSchema,
    prevent: preventCustom = null,
    timeout = 2e3,
    requestError = undefined,
    useCache = true,
    usePrefetch = true,
    debug = false,
    log: logLevel = 'off',
  } = {}) {
    Logger.level = debug === true ? 'debug' : logLevel;

    this._requestError = requestError;
    this._timeout = timeout;
    this._useCache = useCache;
    this._usePrefetch = usePrefetch;

    // Init dom with data-attributes schema
    dom.init({ attributeSchema: schema });
    // Init prevent with data-attributes schema
    this.prevent.init({ attributeSchema: schema });
    // Add prevent custom
    if (preventCustom !== null) {
      if (typeof preventCustom !== 'function') {
        throw new Error('[@barba/core] Prevent should be a function');
      }

      this.prevent.add('preventCustom', preventCustom);
    }

    // Get wrapper
    this._wrapper = dom.getWrapper();
    if (!this._wrapper) {
      throw new Error('[@barba/core] No Barba wrapper found');
    }

    // A11y
    this._wrapper.setAttribute('aria-live', 'polite');

    // Store
    this.store = store.init(transitions);
    // Views manager
    viewsManager.init(this, views);

    // Init pages
    this._initPages();

    // Set/update history
    history.add(this._current.url, this._current.namespace);

    if (!this._current.container) {
      throw new Error('[@barba/core] No Barba container found');
    }

    // TODO: check network connectivity / reduced data usage mode?
    // Add to cache
    this.cache.set(this._current.url, Promise.resolve(this._current.html));

    // Bindings
    /* istanbul ignore else */
    if (this._useCache && this._usePrefetch) {
      this._onLinkEnter = this._onLinkEnter.bind(this);
      this._onLinkClick = this._onLinkClick.bind(this);
    }
    this._onStateChange = this._onStateChange.bind(this);
    this._bind();

    // Init plugins
    this._plugins.forEach(plugin => plugin.init());

    this.appear();
  },

  get wrapper() {
    return this._wrapper;
  },

  // DEV
  // destroy() {
  //   this.hooks = hooks.destroy();
  //   this._plugins = [];

  //   this._unbind();
  // },

  _bind() {
    /* istanbul ignore else */
    if (this._useCache && this._usePrefetch) {
      document.addEventListener('mouseover', this._onLinkEnter);
      document.addEventListener('touchstart', this._onLinkEnter);
    }
    document.addEventListener('click', this._onLinkClick);
    window.addEventListener('popstate', this._onStateChange);
  },

  // DEV
  // _unbind() {
  //   if (this._useCache && this._usePrefetch) {
  //     document.removeEventListener('mouseover', this._onLinkEnter);
  //     document.removeEventListener('touchstart', this._onLinkEnter);
  //   }
  //   document.removeEventListener('click', this._onLinkClick);
  //   window.removeEventListener('popstate', this._onStateChange);
  // },

  _onLinkEnter(e) {
    let el = e.target;

    while (el && !this.utils.getHref(el)) {
      el = el.parentNode;
    }

    // Check prevent
    if (!el || this.prevent.check(el, e, el.href)) {
      return;
    }

    const url = this.utils.getHref(el);

    // Already in cache
    if (this.cache.has(url)) {
      return;
    }

    this.cache.set(
      url,
      this.request(
        url,
        this._timeout,
        this._onRequestError.bind(this, 'enter')
      ).catch(error => this.logger.error(error))
    );
  },

  _onLinkClick(e) {
    let el = e.target;

    while (el && !this.utils.getHref(el)) {
      el = el.parentNode;
    }

    // Check prevent
    if (!el || this.prevent.check(el, e, el.href)) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    // Check prevent sameURL
    if (!el || this.prevent.sameUrl(el.href)) {
      // Same URL -> force reload
      this.force(el.href);

      return;
    }

    this.go(this.utils.getHref(el), el);
  },

  _onStateChange() {
    const url = this.utils.getUrl();

    this.go(url, 'popstate');
  },

  _onRequestError(action, ...args) {
    const [url, error] = args;

    this.cache.delete(url);

    // Custom requestError returning false will return here;
    if (
      this._requestError &&
      this._requestError(action, url, error) === false
    ) {
      return;
    }

    // Force page change
    if (action === 'click') {
      this.force(url);
    }
  },

  async appear() {
    // Check if appear transition
    if (this.store.hasAppear) {
      try {
        const data = this._getData();
        const transition = this.store.get(data, true);

        await this.manager.doAppear({ transition, data });
      } catch (error) {
        this.logger.error(error);
      }
    }
  },

  async go(url, trigger = 'barba') {
    // If animation running, force reload
    if (this.manager.running) {
      this.force(url);

      return;
    }

    this._next.url = url;
    this._trigger = trigger;

    let page;

    if (this._useCache) {
      /* eslint-disable indent */
      page = this.cache.has(url)
        ? this.cache.get(url)
        : this.cache.set(
            url,
            this.request(
              url,
              this._timeout,
              this._onRequestError.bind(this, 'click')
            )
          );
      /* eslint-enable indent */
    } else {
      page = this.request(
        url,
        this._timeout,
        this._onRequestError.bind(this, 'click')
      );
    }

    // Need to wait before getting the right transition
    if (this.store.wait) {
      await page.then(html => {
        const nextDocument = dom.toDocument(html);

        this._next.namespace = dom.getNamespace(nextDocument);
        this._next.container = dom.getContainer(nextDocument);
        this._next.html = dom.getHtml(nextDocument);
      });
    }

    if (trigger === 'popstate') {
      history.add(url, this._next.namespace);
    } else {
      history.go(url, this._next.namespace);
    }

    const data = this._getData();

    // Hook: between trigger and transition
    // Can be used to resolve "route"…
    hooks.do('go', data);

    try {
      const transition = this.store.get(data);

      await this.manager.doPage({
        transition,
        data,
        page,
        wrapper: this._wrapper,
      });

      this._updateTitle(data);
      this._refreshPages();
    } catch (error) {
      // TODO: !!! infinite loop on transition error???
      history.cancel();
      this.logger.error(error);
    }
  },

  // DEV
  // Can be used waiting animation cancellation management…
  force(url) {
    window.location.assign(url);
  },

  _getData() {
    return {
      current: this._current,
      next: this._next,
      trigger: this._trigger,
    };
  },

  _initPages() {
    this._refreshPages();
  },

  _refreshPages() {
    this._current = { ...this.pageSchema };
    this._next = { ...this.pageSchema };

    this._current.namespace = dom.getNamespace();
    this._current.url = this.utils.getUrl();
    this._current.container = dom.getContainer();
    this._current.html = dom.getHtml();

    // Hook: reset current/next pages
    // Can be used to resolve "route"…
    // TODO: naming…
    hooks.do('refresh', this._getData());
  },

  _updateTitle(data) {
    const { html } = data.next;
    const { title } = dom.toDocument(html);

    document.title = title;
  },
};
