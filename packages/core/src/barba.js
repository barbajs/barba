import { version } from '../package.json';
import { attributeSchema, pageSchema } from './schema';
import { manager, store } from './transitions';
import cache from './cache';
import dom from './dom';
import history from './history';
import hooks from './hooks';
import prevent from './prevent';
import request from './request';
import { getHref, getUrl } from './utils';

export const barba = {
  version,
  wrapper: null,
  current: null,
  next: null,
  trigger: null,
  store: null,
  hooks: hooks.init(),
  pageSchema,
  _plugins: [],

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

  init({
    debug = false,
    transitions = [],
    views = [],
    schema = attributeSchema,
    useCache = true,
    usePrefetch = true,
  } = {}) {
    // DEV
    console.info(views);

    this.useCache = useCache;
    this.usePrefetch = usePrefetch;

    // Init dom with data-attributes schema
    dom.init({ attributeSchema: schema });
    // Init prevent with data-attributes schema
    prevent.init({ attributeSchema: schema });

    // Get wrapper
    this.wrapper = dom.getWrapper();
    if (!this.wrapper) {
      throw new Error('No Barba wrapper found');
    }
    // A11y
    this.wrapper.setAttribute('aria-live', 'polite');

    // Store
    store.init(transitions, debug);

    // Init pages
    this.initPages();
    history.add(this.current.url, this.current.namespace);

    if (!this.current.container) {
      throw new Error('No Barba container found');
    }

    // Add to cache
    cache.set(this.current.url, Promise.resolve(this.current.html));

    // Set/update history

    // Bindings
    if (this.useCache && this.usePrefetch) {
      this.onLinkEnter = this.onLinkEnter.bind(this);
      this.onLinkClick = this.onLinkClick.bind(this);
    }
    this.onStateChange = this.onStateChange.bind(this);
    this.bind();

    // Init plugins
    this._plugins.forEach(plugin => plugin.init());

    this.appear();
  },

  destroy() {
    this.wrapper = null;
    this.current = null;
    this.next = null;
    this.trigger = null;
    this.hooks = hooks.destroy();
    this._plugins = [];

    this.unbind();
  },

  bind() {
    if (this.useCache && this.usePrefetch) {
      document.addEventListener('mouseover', this.onLinkEnter);
      document.addEventListener('touchstart', this.onLinkEnter);
    }
    document.addEventListener('click', this.onLinkClick);
    window.addEventListener('popstate', this.onStateChange);
  },

  unbind() {
    if (this.useCache && this.usePrefetch) {
      document.removeEventListener('mouseover', this.onLinkEnter);
      document.removeEventListener('touchstart', this.onLinkEnter);
    }
    document.removeEventListener('click', this.onLinkClick);
    window.removeEventListener('popstate', this.onStateChange);
  },

  onLinkEnter(e) {
    let el = e.target;

    while (el && !getHref(el)) {
      el = el.parentNode;
    }

    // Check prevent
    if (!el || prevent.tests.hasAttr({ el })) {
      return;
    }

    const url = el.href;

    // Already in cache
    if (cache.has(url)) {
      return;
    }

    cache.set(url, request(url));
  },

  onLinkClick(e) {
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
      return;
    }

    this.go(getHref(el), el);
  },

  onStateChange(e) {
    const url = getUrl();

    console.info(e);

    return;

    this.go(url, 'popstate');
  },

  async appear() {
    // Check if appear transition
    if (store.appear.length > 0) {
      try {
        const data = this.getData();
        const transition = store.get(data, true);

        await manager.doAppear({ transition, data });
      } catch (error) {
        // TODO: handle errors
        console.error(error);
      }
    }
  },

  async go(url, trigger = 'barba') {
    this.next.url = url;
    this.trigger = trigger;

    // TODO: question? can be used for "back/reverse" transition (naming?)
    // bof: which use case. do not play well with go/back/go…
    // const back = history.previous() && url === history.previous().url;
    let page;

    if (this.useCache) {
      page = cache.has(url) ? cache.get(url) : cache.set(url, request(url));
    } else {
      page = request(url);
    }

    // Need to wait before getting the right transition
    if (store.wait) {
      await page.then(html => {
        const nextDocument = dom.toDocument(html);

        this.next.namespace = dom.getNamespace(nextDocument);
        this.next.container = dom.getContainer(nextDocument);
        this.next.html = dom.getHtml(nextDocument);
      });
    }

    if (trigger === 'popstate') {
      history.add(url, this.next.namespace);
    } else {
      history.go(url, this.next.namespace);
    }

    const data = this.getData();

    // Hook: between trigger and transition
    // Can be used to resolve "route"…
    hooks.do('go', data);

    try {
      const transition = store.get(data);

      await manager.doPage({
        transition,
        data,
        page,
        wrapper: this.wrapper,
      });

      this.refreshPages();
    } catch (error) {
      // TODO: !!! infinite loop on transition error???
      history.cancel();
      // TODO: handle errors
      console.error(error);
    }
  },

  // DEV
  // Can be used waiting animation cancellation management…
  force(url) {
    window.location = url;
  },

  getData() {
    return {
      current: this.current,
      next: this.next,
      trigger: this.trigger,
    };
  },

  initPages() {
    this.refreshPages();
  },

  refreshPages() {
    this.current = { ...this.pageSchema };
    this.next = { ...this.pageSchema };

    this.current.namespace = dom.getNamespace();
    this.current.url = getUrl();
    this.current.container = dom.getContainer();
    this.current.html = dom.getHtml();

    // Hook: reset current/next pages
    // Can be used to resolve "route"…
    // TODO: naming…
    hooks.do('refresh', this.getData());
  },
};

export default barba;
