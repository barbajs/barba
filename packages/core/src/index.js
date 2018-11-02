import { version } from '../package.json';
import { attributeSchema, pageSchema } from './schema';
import { manager, store } from './transitions';
import cache from './cache';
import dom from './dom';
import hooks from './hooks';
import prevent from './prevent';
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

  init(
    options = {
      debug: false,
      cache: false,
      prefetch: false,
      transitions: [],
      views: [],
      attributeSchema,
    }
  ) {
    this.options = options;

    // DEV
    // if (process.env.NODE_ENV === 'test') {
    //   this.options.debug = true;
    // }

    // Init dom with data-attributes schema
    dom.init({ attributeSchema: this.options.attributeSchema });
    // Init prevent with data-attributes schema
    prevent.init({ attributeSchema: this.options.attributeSchema });

    // Get wrapper
    this.wrapper = dom.getWrapper();
    if (!this.wrapper) {
      throw new Error('No Barba wrapper found');
    }
    // A11y
    this.wrapper.setAttribute('aria-live', 'polite');

    // Store
    this.store = store.init(this.options.transitions, this.options.debug);

    // Init current set
    this.current = { ...this.pageSchema };
    this.next = { ...this.pageSchema };

    // TODO: refactor, create function update || updateData
    this.current.namespace = dom.getNamespace();
    this.current.url = getUrl();
    this.current.container = dom.getContainer();
    this.current.html = dom.getHtml();

    if (!this.current.container) {
      throw new Error('No Barba container found');
    }

    // Add to cache
    cache.set(this.current.url, this.current.html);

    // Set/update history

    // Bindings
    this.onClick = this.onClick.bind(this);
    this.onURLChange = this.onURLChange.bind(this);
    this.bind();

    // Init plugins
    this._plugins.forEach(plugin => plugin.init());

    this.appear();
    this.go('/foo.html', null);
  },

  destroy() {
    this.wrapper = null;
    this.current = null;
    this.next = null;
    this.trigger = null;
    this.store = null;
    this.hooks = hooks.destroy();
    this.pageSchema = pageSchema;
    this._plugins = [];

    this.unbind();
  },

  bind() {
    document.addEventListener('click', this.onClick);
    window.addEventListener('popstate', this.onURLChange);
  },

  unbind() {
    document.removeEventListener('click', this.onClick);
    window.removeEventListener('popstate', this.onURLChange);
  },

  onClick(e) {
    let el = e.target;

    while (el && !getHref(el)) {
      el = el.parentNode;
    }

    // Check prevent
    if (prevent.check(el, e, el.href)) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.go(getHref(el), el);
  },

  onURLChange() {
    console.info('onURLChange');
  },
  appear() {
    // Check if appear transition?
    // then, make stuff
    const data = this.getData();

    manager.doAppear(this.store.get(data, true), data);
  },
  go(url, trigger) {
    this.trigger = trigger;

    // Get from cache ?
    // console.info('GOOOOOO!!!', this.transitions.hasTo);

    // If no cache AND hasTo transitions, wait for fetch
    // Else get transition

    const data = {
      current: this.current,
      next: {
        // DEV
        // namespace: dom.getNamespace(),
        url,
        // #ROUTER: should access to this.next.url and set this.next.route
        // route: null,
        // DEV
        // container: dom.getContainer(),
        // html: dom.getHtml(),
      },
      trigger,
    };

    // #ROUTER hook or event between trigger/go AND transition…
    hooks.do('go', data);

    // Get transition infos
    const t = this.store.get(data);

    // Do transition
    // console.info('T', t);
    manager.doPage(t, data);
  },
  getData() {
    return {
      current: this.current,
      next: this.next,
      trigger: this.trigger,
    };
  },
};

export default barba;
