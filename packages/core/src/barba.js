import { version } from '../package.json';
import { attributeSchema, pageSchema } from './schema';
import { manager, store } from './transitions';
import cache from './cache';
import dom from './dom';
import history from './history';
import hooks from './hooks';
import prevent from './prevent';
import request from './request';
import viewsManager from './views';
import { getHref, getUrl } from './utils';

import './polyfills';

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
   * Transitions store
   *
   * @memberof @barba/core
   * @type {store}
   */
  store,

  /**
   * Transitions manager
   *
   * @memberof @barba/core
   * @type {manager}
   */
  manager,

  /**
   * Hooks
   *
   * @memberof @barba/core
   * @type {hooks}
   */
  hooks: hooks.init(),

  /**
   * Page object structure
   *
   * @memberof @barba/core
   * @type {import('./defs.js').pageSchema}
   */
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
   * @param {plugin} plugin - Plugin
   * @param  {...any} args - Other arguments
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
  /**
   * Init barba
   *
   * @memberof @barba/core
   * @param {Object} options - Options
   * @param {boolean} [options.debug=false] - Debug
   * @param {import('./defs.js').transition[]} options.transitions - Transition array
   * @param {import('./defs.js').attributeSchema=} options.schema - Schema
   * @param {boolean} [options.useCache=true] - Cache
   * @param {boolean} [options.usePrefetch=true] - Prefetch
   * @returns {undefined}
   */
  /* eslint-enable */
  init({
    debug = false,
    transitions = [],
    views = [],
    schema = attributeSchema,
    prevent: preventCustom = null,
    useCache = true,
    usePrefetch = true,
  } = {}) {
    this._useCache = useCache;
    this._usePrefetch = usePrefetch;

    // Init dom with data-attributes schema
    dom.init({ attributeSchema: schema });
    // Init prevent with data-attributes schema
    prevent.init({ attributeSchema: schema });
    // Add prevent custom
    if (preventCustom !== null) {
      if (typeof preventCustom !== 'function') {
        throw new Error('Prevent should be a function');
      }

      prevent.add('preventCustom', preventCustom);
    }

    // Get wrapper
    this._wrapper = dom.getWrapper();
    if (!this._wrapper) {
      throw new Error('No Barba wrapper found');
    }

    // A11y
    this._wrapper.setAttribute('aria-live', 'polite');

    // Store
    this.store = store.init(transitions, debug);
    // Views manager
    viewsManager.init(this, views);

    // Init pages
    this._initPages();

    // Set/update history
    history.add(this._current.url, this._current.namespace);

    if (!this._current.container) {
      throw new Error('No Barba container found');
    }

    // Add to cache
    cache.set(this._current.url, Promise.resolve(this._current.html));

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

    while (el && !getHref(el)) {
      el = el.parentNode;
    }

    // Check prevent
    // if (!el || prevent._tests.hasAttr({ el })) {
    // TODO: all prevent tests before fetching/caching?
    if (!el || prevent.check(el, e, el.href)) {
      return;
    }

    const url = getHref(el);

    // Already in cache
    if (cache.has(url)) {
      return;
    }

    cache.set(url, request(url));
  },

  _onLinkClick(e) {
    let el = e.target;

    while (el && !getHref(el)) {
      el = el.parentNode;
    }

    // Check prevent
    if (!el || prevent.check(el, e, el.href)) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    // Check prevent sameURL
    if (!el || prevent.sameUrl(el.href)) {
      // TODO: do nothing or force reload?
      this.force(el.href);

      return;
    }

    this.go(getHref(el), el);
  },

  _onStateChange() {
    const url = getUrl();

    this.go(url, 'popstate');
  },

  async appear() {
    // Check if appear transition
    if (this.store.hasAppear) {
      try {
        const data = this._getData();
        const transition = this.store.get(data, true);

        await this.manager.doAppear({ transition, data });
      } catch (error) {
        // TODO: handle errors
        // console.error(error);
        throw new Error(error);
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

    // TODO: question? can be used for "back/reverse" transition (naming?)
    // bof: which use case. do not play well with go/back/go…
    // const back = history.previous() && url === history.previous().url;
    let page;

    if (this._useCache) {
      page = cache.has(url) ? cache.get(url) : cache.set(url, request(url));
    } else {
      page = request(url);
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

      this._refreshPages();
    } catch (error) {
      // TODO: !!! infinite loop on transition error???
      history.cancel();
      // TODO: handle errors
      // console.error(error);
      throw new Error(error);
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
    this._current.url = getUrl();
    this._current.container = dom.getContainer();
    this._current.html = dom.getHtml();

    // Hook: reset current/next pages
    // Can be used to resolve "route"…
    // TODO: naming…
    hooks.do('refresh', this._getData());
  },
};
