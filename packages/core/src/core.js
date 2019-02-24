import { version } from '../package.json';
import { attributeSchema, pageSchema } from './schemas';
import {
  cache,
  history,
  hooks,
  store,
  transitions as transitionsManager,
  views as viewsManager,
} from './modules';
import { dom, request, helpers, prevent, url, Logger } from './utils';

// DEV
// import './polyfills';
// import './definitions';

/**
 * Barba core
 *
 * @namespace @barba/core
 * @type {Object}
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
   * Page schema (object structure)
   *
   * @memberof @barba/core
   * @type {module:core/schemas/page.pageSchema}
   */
  pageSchema,

  /**
   * Cache module
   *
   * @memberof @barba/core
   * @type {cache}
   */
  cache,

  /**
   * History module
   *
   * @memberof @barba/core
   * @type {history}
   */
  history,

  /**
   * Hooks module
   *
   * @memberof @barba/core
   * @type {hooks}
   */
  hooks: hooks.init(),

  /**
   * Store module
   *
   * @memberof @barba/core
   * @type {store}
   */
  store,

  /**
   * Transitions manager
   *
   * @memberof @barba/core
   * @type {transitions}
   */
  transitionsManager,

  /**
   * Views manager
   *
   * @memberof @barba/core
   * @type {views}
   */
  viewsManager,

  /**
   * Dom (utils)
   *
   * @memberof @barba/core
   * @type {dom}
   */
  dom,

  /**
   * Prevent (utils)
   *
   * @memberof @barba/core
   * @type {prevent}
   */
  prevent,

  /**
   * Request (utils)
   *
   * @memberof @barba/core
   * @type {request}
   */
  request,

  /**
   * Helpers (utils)
   *
   * @memberof @barba/core
   * @type {object}
   */
  helpers,

  /**
   * URL (utils)
   *
   * @memberof @barba/core
   * @type {object}
   */
  url,

  /**
   * Logger (utils)
   *
   * @memberof @barba/core
   * @type {Logger}
   */
  Logger,

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
   * @param {module:core/modules/views.view[]} [options.views=[]] - Views array
   * @param {module:core/schemas/attribute.attributeSchema} [options.schema=attributeSchema] - Schema
   * @param {function} [options.requestError=undefined] - Request error callback
   * @param {number} [options.timeout=5000] - Request timeout
   * @param {boolean} [options.useCache=true] - Enable cache
   * @param {boolean} [options.usePrefetch=true] - Enable prefetch
   * @param {boolean} [options.debug=false] - Debug mode
   * @param {string} [options.log='off'] - Log level
   * @returns {void}
   */
  init({
    transitions = [],
    views = [],
    schema = attributeSchema,
    prevent: preventCustom = null,
    timeout = 2e3,
    requestError = undefined,
    // TODO: refactor options + behaviour
    // cacheIgnore
    // prefetchIgnore (merged or overridden with @barba/prefetch)
    useCache = true,
    usePrefetch = true,
    debug = false,
    log: logLevel = 'off',
  } = {}) {
    // Create core logger
    Logger.level = debug === true ? 'debug' : logLevel;
    this.logger = new this.Logger('@barba/core');

    // Save options
    this._requestError = requestError;
    this._timeout = timeout;
    this.useCache = useCache;
    this.usePrefetch = usePrefetch;

    // 1. Init modules/utils with data-attributes schema
    this.dom.init({ attributeSchema: schema });
    this.prevent.init({ attributeSchema: schema });
    // Add prevent custom
    if (preventCustom !== null) {
      if (typeof preventCustom !== 'function') {
        throw new Error('[@barba/core] Prevent should be a function');
      }

      this.prevent.add('preventCustom', preventCustom);
    }

    // 2. Wrapper
    this._wrapper = this.dom.getWrapper();
    if (!this._wrapper) {
      throw new Error('[@barba/core] No Barba wrapper found');
    }
    this._wrapper.setAttribute('aria-live', 'polite'); // A11y

    // 3. Init pages (get "current" data)
    this._refreshPages();
    if (!this._current.container) {
      throw new Error('[@barba/core] No Barba container found');
    }

    // 4. Init other modules
    this.store.init(transitions);
    this.viewsManager.init(views);

    // 5. Use "current" data
    // Set/update history
    history.add(this._current.url.href, this._current.namespace);
    // Add to cache
    this.useCache &&
      this.cache.set(
        this._current.url.href,
        Promise.resolve(this._current.html)
      );

    // 6. Bindings
    this._onLinkEnter = this._onLinkEnter.bind(this);
    this._onLinkClick = this._onLinkClick.bind(this);
    this._onStateChange = this._onStateChange.bind(this);
    this._bind();

    // 7. Init plugins
    this._plugins.forEach(plugin => plugin.init());

    // 8. Finally, do appear…
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
    if (this.usePrefetch) {
      document.addEventListener('mouseover', this._onLinkEnter);
      document.addEventListener('touchstart', this._onLinkEnter);
    }
    document.addEventListener('click', this._onLinkClick);
    window.addEventListener('popstate', this._onStateChange);
  },

  _onLinkEnter(e) {
    const el = this._getLinkElement(e);

    if (!el) {
      return;
    }

    const url = this.dom.getUrl(el);

    // Already in cache
    if (this.cache.has(url)) {
      return;
    }

    this.cache.set(
      url,
      this.request(
        url,
        this._timeout,
        this._onRequestError.bind(this, el, 'enter')
      ).catch(error => this.logger.error(error))
    );
  },

  _onLinkClick(e) {
    const el = this._getLinkElement(e);

    if (!el) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    // Check prevent sameURL
    if (this.prevent.sameUrl(el.href)) {
      // Same URL -> force reload
      this.force(el.href);

      return;
    }

    this.go(this.dom.getUrl(el), el);
  },

  _onStateChange() {
    const href = this.url.getHref();

    this.go(href, 'popstate');
  },

  _onRequestError(trigger, action, ...args) {
    const [url, response] = args;

    this.cache.delete(url);

    // Custom requestError returning false will return here;
    if (
      this._requestError &&
      this._requestError(trigger, action, url, response) === false
    ) {
      return;
    }

    // Force page change
    if (action === 'click') {
      this.force(url);
    }
  },

  _getLinkElement(e) {
    let el = e.target;

    while (el && !this.dom.getUrl(el)) {
      el = el.parentNode;
    }

    // Check prevent
    if (!el || this.prevent.check(el, e, el.href)) {
      return false;
    }

    return el;
  },

  async appear() {
    // Check if appear transition
    if (this.store.hasAppear) {
      try {
        const data = this._getData();
        const transition = this.store.get(data, true);

        await this.transitionsManager.doAppear({ transition, data });
      } catch (error) {
        this.logger.error(error);
      }
    }
  },

  async go(url, trigger = 'barba') {
    // If animation running, force reload
    if (this.transitionsManager.running) {
      this.force(url);

      return;
    }

    this._next.url = {
      href: url,
      ...this.url.parse(url),
    };
    this._trigger = trigger;

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
                this._timeout,
                this._onRequestError.bind(this, trigger, 'click')
              )
            )
            .get(url);
      /* eslint-enable indent */
    } else {
      page = this.request(
        url,
        this._timeout,
        this._onRequestError.bind(this, trigger, 'click')
      );
    }

    // Need to wait before getting the right transition
    if (this.store.wait) {
      await helpers.getPage(page, this._next);
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

      await this.transitionsManager.doPage({
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

  _refreshPages() {
    this._current = { ...this.pageSchema };
    this._next = { ...this.pageSchema };

    const href = this.url.getHref();

    this._current.namespace = this.dom.getNamespace();
    this._current.url = {
      href,
      ...this.url.parse(href),
    };
    this._current.container = this.dom.getContainer();
    this._current.html = this.dom.getHtml();

    // Hook: reset current/next pages
    // Can be used to resolve "route"…
    // TODO: naming…
    hooks.do('refresh', this._getData());
  },

  _updateTitle(data) {
    const { html } = data.next;
    const { title } = this.dom.toDocument(html);

    document.title = title;
  },
};
