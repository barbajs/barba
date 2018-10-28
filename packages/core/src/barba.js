import { version } from '../package.json';
import { defaultSchema } from './schema';
import cache from './cache';
import dom from './dom';
import manager from './manager';
import prevent from './prevent';
import transitions from './transitions';
import { getHref, getUrl } from './utils';

export default {
  version,
  wrapper: undefined,
  current: undefined,
  next: undefined,
  trigger: undefined,
  transitions: null,

  init(
    options = {
      debug: false,
      cache: false,
      prefetch: false,
      transitions: [],
      views: [],
    },
    schema = defaultSchema
  ) {
    this.options = options;
    this.schema = schema;

    // DEV
    if (process.env.NODE_ENV === 'test') {
      this.options.debug = true;
    }

    dom.init(this.schema);

    this.wrapper = dom.getWrapper();
    if (!this.wrapper) {
      throw new Error('No Barba wrapper found');
    }

    this.wrapper.setAttribute('aria-live', 'polite');

    // Plugin stuff (router)

    // Transitions / manager
    this.transitions = transitions.init(
      this.options.transitions,
      this.options.debug
    );

    // Get current data
    this.current = {
      namespace: dom.getNamespace(),
      url: getUrl(),
      route: null,
      container: dom.getContainer(),
      html: dom.getHtml(),
    };

    if (!this.current.container) {
      throw new Error('No Barba container found');
    }

    // Add to cache
    cache.set(this.current.url, this.current.html);

    // Set/update history

    // Do appear ?
    const data = {
      current: this.current,
      next: {},
    };

    // Check if appear transition?
    // then, make stuff
    manager.doAppear(this.transitions.get(data, true), data);

    // Bindings
    this.onClick = this.onClick.bind(this);
    this.onURLChange = this.onURLChange.bind(this);
    this.bind();
  },

  bind() {
    document.addEventListener('click', this.onClick);
    window.addEventListener('popstate', this.onURLChange);
  },

  destroy() {
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

  go(url, trigger) {
    this.trigger = trigger;

    console.info('GOOOOOO!!!', this.transitions.hasTo);
    // Get from cache ?

    // If no cache AND hasTo transitions, wait for fetch
    // Else get transition

    const data = {
      current: this.current,
      next: {
        // DEV
        // namespace: dom.getNamespace(),
        url,
        // DEV
        // route: null,
        // container: dom.getContainer(),
        // html: dom.getHtml(),
      },
      trigger,
    };

    // Get transition infos
    const t = this.transitions.get(data);

    console.info('T', t);
    // Do transition
    manager.doTransition(t, data);
  },
};
