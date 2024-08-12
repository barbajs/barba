/**
 * @barba/core
 * <br><br>
 * ## Barba core object
 *
 * Main methods:
 *
 * - `.init()` for initialization with options
 * - `.use()` for plugins
 *
 * @module core
 */

/***/

import { version } from '../package.json';
// Definitions
import {
  IBarbaOptions,
  IBarbaPlugin,
  IgnoreOption,
  ISchemaPage,
  ITransitionData,
  ITransitionOnce,
  ITransitionPage,
  Link,
  LinkEvent,
  RequestCustomError,
  RequestErrorOrResponse,
  SchemaAttributeValues,
  Trigger,
  Wrapper,
} from './defs';
// Hooks
import { hooks } from './hooks';
// Modules
import { Cache } from './modules/Cache';
import { Headers } from './modules/Headers';
import { Logger } from './modules/Logger';
import { Prevent } from './modules/Prevent';
import { Transitions } from './modules/Transitions';
import { Views } from './modules/Views';
// Polyfills
import './polyfills';
// Schemas
import { schemaAttribute } from './schemas/attribute';
import { schemaPage } from './schemas/page';
// Utils
import { dom, helpers, history, request, url } from './utils';

export class Core {
  /**
   * Version.
   */
  public version: string = version;
  /**
   * Schemas.
   */
  public schemaPage: ISchemaPage = schemaPage;
  /**
   * Logger class, allows plugins to create Logger.
   */
  public Logger: typeof Logger = Logger;
  /**
   * Barba logger.
   */
  public logger: Logger = new Logger('@barba/core');
  /**
   * Plugins.
   */
  public plugins: IBarbaPlugin<any>[] = [];
  /**
   * Options
   */
  public timeout: number;
  public cacheIgnore: IgnoreOption;
  public cacheFirstPage: boolean;
  public prefetchIgnore: IgnoreOption;
  public preventRunning: boolean;
  /**
   * Hooks
   */
  public hooks = hooks;
  /**
   * Modules.
   */
  // public history: History;
  public cache: Cache;
  public headers: Headers;
  public prevent: Prevent;
  public transitions: Transitions;
  public views: Views;
  /**
   * Utils.
   */
  public dom = dom;
  public helpers = helpers;
  public history = history;
  public request = request;
  public url = url;

  private _data: ITransitionData;
  private _requestCustomError: RequestCustomError;
  private _wrapper: Wrapper;
  private _linkEvent: LinkEvent;

  /**
   * ### Init plugin with options.
   *
   * See [[IBarbaPlugin]] for more details.
   */
  public use<T>(plugin: IBarbaPlugin<T>, options?: T): void {
    const installedPlugins = this.plugins;

    // Plugin installation
    if (installedPlugins.indexOf(plugin) > -1) {
      this.logger.warn(`Plugin [${plugin.name}] already installed.`);

      return;
    }

    if (typeof plugin.install !== 'function') {
      this.logger.warn(`Plugin [${plugin.name}] has no "install" method.`);

      return;
    }

    plugin.install(this, options);
    installedPlugins.push(plugin);
  }

  /**
   * ### Init barba with options.
   *
   * See [[IBarbaOptions]] for more details.
   *
   * Default values are:
   *
   * - transitions: `[]`
   * - views: `[]`
   * - schema: [[SchemaAttribute]]
   * - timeout: `2e3`
   * - cacheIgnore: `false`
   * - cacheFirstPage: `false`
   * - prefetchIgnore: `false`
   * - preventRunning: `false`
   * - prevent: `null`,
   * - debug: `false`
   * - logLevel: `'debug'`
   */
  public init(
    /** @ignore */ {
      transitions = [],
      views = [],
      schema = schemaAttribute,
      requestError,
      timeout = 2e3,
      cacheIgnore = false,
      cacheFirstPage = false,
      prefetchIgnore = false,
      /* istanbul ignore next */
      preventRunning = false,
      prevent: preventCustom = null,
      debug = false,
      logLevel = 'off',
    }: IBarbaOptions = {}
  ) {
    // 0. Set logger level and print version
    Logger.setLevel(debug === true ? 'debug' : logLevel);
    this.logger.info(this.version);

    // 1. Manage options
    Object.keys(schema).forEach(k => {
      const attr = k as SchemaAttributeValues;

      /* istanbul ignore else */
      if (schemaAttribute[attr]) {
        schemaAttribute[attr] = schema[attr];
      }
    });
    this._requestCustomError = requestError;
    this.timeout = timeout;
    this.cacheIgnore = cacheIgnore;
    this.cacheFirstPage = cacheFirstPage;
    this.prefetchIgnore = prefetchIgnore;
    this.preventRunning = preventRunning;

    // 2. Get and check wrapper
    this._wrapper = this.dom.getWrapper();
    if (!this._wrapper) {
      throw new Error('[@barba/core] No Barba wrapper found');
    }

    // 3. Init pages (get "current" data)
    this._resetData();

    const { current } = this.data;

    if (!current.container) {
      throw new Error('[@barba/core] No Barba container found');
    }

    // 4. Init other modules
    this.cache = new Cache(cacheIgnore);
    this.headers = new Headers();
    this.prevent = new Prevent(prefetchIgnore);
    this.transitions = new Transitions(transitions);
    this.views = new Views(views);

    // Add prevent custom
    if (preventCustom !== null) {
      if (typeof preventCustom !== 'function') {
        throw new Error('[@barba/core] Prevent should be a function');
      }

      this.prevent.add('preventCustom', preventCustom);
    }

    // 5. Init history
    this.history.init(current.url.href, current.namespace);

    // 6. Add to cache
    if (cacheFirstPage) {
      this.cache.set(current.url.href, Promise.resolve({
        html: current.html,
        url: current.url,
      }), 'init', 'fulfilled');
    }

    // 7. Bind context
    this._onLinkEnter = this._onLinkEnter.bind(this);
    this._onLinkClick = this._onLinkClick.bind(this);
    this._onStateChange = this._onStateChange.bind(this);
    this._bind();

    // 8. Init plugins
    this.plugins.forEach(plugin => plugin.init());

    // 9. Barba ready
    // Set next + trigger for once and `beforeEnter`/`afterEnter` view on page load.
    const onceData = this.data;

    onceData.trigger = 'barba';
    onceData.next = onceData.current;
    onceData.current = { ...this.schemaPage };
    this.hooks.do('ready', onceData);

    // 9. Finally, do once…
    this.once(onceData);

    // Clean data for first barba transition…
    this._resetData();
  }

  public destroy(): void {
    this._resetData();
    this._unbind();
    this.history.clear();
    this.hooks.clear();
    this.plugins = [];
  }

  get data(): ITransitionData {
    return this._data;
  }

  get wrapper(): HTMLElement {
    return this._wrapper;
  }

  /**
   * ### Force a page change without Barba transition.
   */
  public force(href: string): void {
    // DEV
    // Can be used waiting animation cancellation management…
    window.location.assign(href);
  }

  /**
   * ### Go for a Barba transition.
   *
   * Manage "self page" href:
   *
   * - if same url and no self transition, keep default behavior
   *   - link: reload the page
   *   - anchor: scroll to
   * - if same url with self transition, use it
   * - then start a page transition.
   */
  public go(
    href: string,
    trigger: Trigger = 'barba',
    e?: LinkEvent | PopStateEvent
  ): Promise<void> {
    this._linkEvent = null;

    // If animation running, force reload
    if (this.transitions.isRunning) {
      this.force(href);

      return;
    }

    let self = false;

    // Check prevent sameURL against current history
    // + state check
    // + update trigger with direction
    if (trigger === 'popstate') {
      self =
        this.history.current &&
        this.url.getPath(this.history.current.url) === this.url.getPath(href) &&
        this.url.getQuery(this.history.current.url, true) === this.url.getQuery(href, true);
    } else {
      self = this.prevent.run('sameUrl', null, null, href);
    }

    if (self && !this.transitions.hasSelf) {
      return;
    }

    trigger = this.history.change(this.cache.has(href) ? this.cache.get(href).target : href, trigger, e);

    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    return this.page(href, trigger, e ?? undefined, self);
  }

  /**
   * ### Start an "once" transition.
   *
   * If some registered "once" transition,
   * get the "resolved" transition from the store and start it.
   */
  public async once(readyData: ITransitionData): Promise<void> {
    await this.hooks.do('beforeEnter', readyData);

    // Check if once transition
    if (this.transitions.hasOnce) {
      const transition = this.transitions.get(readyData, {
        once: true,
      }) as ITransitionOnce;

      await this.transitions.doOnce({ transition, data: readyData });
    }

    await this.hooks.do('afterEnter', readyData);
  }

  /**
   * ### Start a "page" transition.
   *
   * 1. If no running transition, updates data with full URL properties and trigger.
   * 2. Get page from cache or init request.
   * 3. Wait if some transitions need "next" data (`sync: true`, `to: …`).
   * 4. Manage the history, depending on trigger.
   * 5. Get "data" and trigger "go" hook.
   * 6. Get the "resolved" transition from the store and start it.
   * 7. Update title and reset data (current, next = undefined).
   *
   * > If "self", use the "self" transition
   */
  public async page(
    href: string,
    trigger: Trigger,
    event: LinkEvent | PopStateEvent,
    self: boolean
  ): Promise<void> {
    this.data.next.url = {
      href,
      ...this.url.parse(href),
    };
    this.data.trigger = trigger;
    this.data.event = event;

    let page;

    if (this.cache.has(href)) {
      page = this.cache.update(href, { action: 'click' }).request;
    } else {
      const pageRequest = this.request(
        href,
        this.timeout,
        this.onRequestError.bind(this, trigger),
        this.cache,
        this.headers
      );

      // manage 301 server response: replace history
      pageRequest.then(response => {
        /* istanbul ignore next: bypass jest since xhr-mock doesn't support custom xhr.responseURL */
        if (response.url.href !== href) {
          this.history.add(response.url.href, trigger, 'replace');
        }
      });

      page = this.cache.set(href, pageRequest, 'click', 'pending').request;
    }

    // Need to wait before getting the right transition
    if (this.transitions.shouldWait) {
      await helpers.update(page, this.data);
    }

    const data = this.data;

    // Hook: between trigger and transition
    // Can be used to resolve "route"…
    await this.hooks.do('page', data);

    try {
      const transition = this.transitions.get(data, {
        once: false,
        self,
      }) as ITransitionPage;

      await this.transitions.doPage({
        data,
        page,
        transition,
        wrapper: this._wrapper,
      });

      this._resetData();
    } catch (error) {
      // Something went wrong (rejected promise, error, 404, 505, other…)
      // TODO: manage / use cases for cancellation
      // this.logger.debug('Transition cancelled');

      // If transition error and no debug mode, force reload page.
      /* istanbul ignore else */
      if (Logger.getLevel() === 0) {
        this.force(data.next.url.href);
      }
    }
  }

  /**
   * When a request error occurs.
   *
   * Allow the user to manage request error. (E.g: 404)
   */
  public onRequestError(trigger: Trigger, ...args: any): boolean {
    // Cancel transition status
    this.transitions.isRunning = false;

    const [href, response]: [string, RequestErrorOrResponse] = args;
    const action = this.cache.getAction(href);
    this.cache.delete(href);

    // Custom requestError returning false will return here.
    if (
      this._requestCustomError &&
      this._requestCustomError(trigger, action, href, response) === false
    ) {
      return false;
    }

    // Force page change
    if (action === 'click') {
      this.force(href);
    }
    return false;
  }

  /**
   * Programmatically prefetch
   */
  public prefetch(href: string) {

    // only prefetch absolute href
    href = this.url.getAbsoluteHref(href);

    // Already in cache
    /* istanbul ignore next */
    if (this.cache.has(href)) {
      return;
    }

    this.cache.set(
      href,
      this.request(
        href,
        this.timeout,
        this.onRequestError.bind(this, 'barba'),
        this.cache,
        this.headers
      ).catch((error: RequestErrorOrResponse) => {
        this.logger.error(error);
      }),
      'prefetch',
      'pending'
    );
  }

  /**
   * Bind event listeners.
   */
  private _bind(): void {
    /* istanbul ignore else */
    if (this.prefetchIgnore !== true) {
      document.addEventListener('mouseover', this._onLinkEnter);
      document.addEventListener('touchstart', this._onLinkEnter);
    }
    document.addEventListener('click', this._onLinkClick);
    window.addEventListener('popstate', this._onStateChange);
  }

  /**
   * Bind event listeners.
   */
  private _unbind(): void {
    /* istanbul ignore else */
    if (this.prefetchIgnore !== true) {
      document.removeEventListener('mouseover', this._onLinkEnter);
      document.removeEventListener('touchstart', this._onLinkEnter);
    }
    document.removeEventListener('click', this._onLinkClick);
    window.removeEventListener('popstate', this._onStateChange);
  }

  /**
   * When a element is entered.
   *
   * Get valid link element.
   * Cache URL if needed.
   */
  private _onLinkEnter(e: LinkEvent): void {
    const link = this._getLinkElement(e);

    if (!link) {
      return;
    }

    const href = this.url.getAbsoluteHref(this.dom.getHref(link));

    if (this.prevent.checkHref(href)) {
      return;
    }

    // Already in cache
    if (this.cache.has(href)) {
      return;
    }

    this.cache.set(
      href,
      this.request(
        href,
        this.timeout,
        this.onRequestError.bind(this, link),
        this.cache,
        this.headers
      ).catch((error: RequestErrorOrResponse) => {
        this.logger.error(error);
      }),
      'enter',
      'pending'
    );
  }

  /**
   * When an element is clicked.
   *
   * Get valid link element.
   * Prevent same URL.
   * Go for a Barba transition.
   */
  private _onLinkClick(e: LinkEvent): void {

    // This use `prevent.checkLink` under the hood to get eligible link.
    const link = this._getLinkElement(e);

    if (!link) {
      return;
    }

    if (this.transitions.isRunning && this.preventRunning) {
      e.preventDefault();
      e.stopPropagation();

      return;
    }

    this._linkEvent = e;

    this.go(this.dom.getHref(link), link, e);
  }

  /**
   * When History state changes.
   *
   * Get "href" from URL
   * Go for a Barba transition.
   */
  private _onStateChange(e: PopStateEvent): void {
    this.go(this.url.getHref(), 'popstate', e);
  }

  /**
   * Get a valid link ancestor.
   *
   * Check for a "href" attribute.
   * Then check if eligible for Barba.
   */
  private _getLinkElement(e: LinkEvent): Link {
    let el = e.target as Link;

    while (el && !this.dom.getHref(el)) {
      el = (el as HTMLElement).parentNode as Link;
    }

    // Check prevent
    if (!el || this.prevent.checkLink(el, e, this.dom.getHref(el))) {
      return;
    }

    return el;
  }

  /**
   * Reset pages data.
   *
   * Set "current" and unset "next".
   */
  private _resetData() {
    const href = this.url.getHref();
    const current = {
      container: this.dom.getContainer(),
      html: this.dom.getHtml(),
      namespace: this.dom.getNamespace(),
      url: {
        href,
        ...this.url.parse(href),
      },
    };

    this._data = {
      current,
      event: undefined,
      next: { ...this.schemaPage },
      trigger: undefined,
    };

    this.hooks.do('reset', this.data);
  }
}

const core = new Core();

export default core;
