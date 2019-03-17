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
  ITransitionAppear,
  ITransitionData,
  ITransitionPage,
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
import { History } from './modules/History';
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
import { dom, helpers, request, url } from './utils';

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
  public plugins: Array<IBarbaPlugin<any>> = [];
  /**
   * Options
   */
  public timeout: number;
  public cacheIgnore: IgnoreOption;
  public prefetchIgnore: IgnoreOption;
  /**
   * Hooks
   */
  public hooks = hooks;
  /**
   * Modules.
   */
  public history: History;
  public cache: Cache;
  public prevent: Prevent;
  public transitions: Transitions;
  public views: Views;
  /**
   * Utils.
   */
  public dom = dom;
  public helpers = helpers;
  public request = request;
  public url = url;

  private _data: ITransitionData;
  private _requestCustomError: RequestCustomError;
  private _wrapper: Wrapper;

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
   * - timeout: `2e3`
   * - cacheIgnore: `false`
   * - prefetchIgnore: `false`
   * - schema: [[SchemaAttribute]]
   * - debug: `false`
   * - logLevel: `'debug'`
   */
  public init(
    /** @ignore */ {
      transitions = [],
      views = [],
      prevent: preventCustom = null,
      timeout = 2e3,
      requestError,
      cacheIgnore = false,
      prefetchIgnore = false,
      schema = schemaAttribute,
      debug = false,
      logLevel = 'off',
    }: IBarbaOptions = {}
  ) {
    // 0. Set logger level
    Logger.setLevel(debug === true ? 'debug' : logLevel);

    // 1. Manage options
    Object.keys(schema).forEach(k => {
      const attr = k as SchemaAttributeValues;

      if (schemaAttribute[attr]) {
        schemaAttribute[attr] = schema[attr];
      }
    });
    this._requestCustomError = requestError;
    this.timeout = timeout;
    this.cacheIgnore = cacheIgnore;
    this.prefetchIgnore = prefetchIgnore;

    // 2. Get and check wrapper
    this._wrapper = this.dom.getWrapper();
    if (!this._wrapper) {
      throw new Error('[@barba/core] No Barba wrapper found');
    }
    this._wrapper.setAttribute('aria-live', 'polite'); // A11y

    // 3. Init pages (get "current" data)
    this._resetData();

    const { current } = this.data;

    if (!current.container) {
      throw new Error('[@barba/core] No Barba container found');
    }

    // 4. Init other modules
    this.history = new History();
    this.cache = new Cache(cacheIgnore);
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

    // 5. Use "current" data
    // Set/update history
    this.history.add(current.url.href, current.namespace);
    // Add to cache
    this.cache.set(current.url.href, Promise.resolve(current.html));

    // 6. Bind context
    // this.onRequestError = this.onRequestError.bind(this);
    this._onLinkEnter = this._onLinkEnter.bind(this);
    this._onLinkClick = this._onLinkClick.bind(this);
    this._onStateChange = this._onStateChange.bind(this);
    this._bind();

    // 7. Init plugins
    this.plugins.forEach(plugin => plugin.init());

    // 8. Finally, do appear…
    this.appear();
  }

  public destroy(): void {
    this._resetData();
    this._unbind();
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
   *
   * Check for a "href" attribute.
   * Then check if eligible for Barba.
   */
  public force(href: string): void {
    // DEV
    // Can be used waiting animation cancellation management…
    window.location.assign(href);
  }

  /**
   * ### Start an "appear" transition.
   *
   * If some registered "appear" transition,
   * get the "resolved" transition from the store and start it.
   */
  public async appear(): Promise<void> {
    // Check if appear transition
    if (this.transitions.hasAppear) {
      try {
        const data = this._data;
        const transition = this.transitions.get(
          data,
          true
        ) as ITransitionAppear;

        await this.transitions.doAppear({ transition, data });
      } catch (error) {
        this.logger.error(error);
      }
    }
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
   * 7. Update title and reset data (current, next = undefined)
   */
  public async go(href: string, trigger: Trigger = 'barba'): Promise<void> {
    // If animation running, force reload
    if (this.transitions.isRunning) {
      this.force(href);

      return;
    }

    this.data.next.url = {
      href,
      ...this.url.parse(href),
    };
    this.data.trigger = trigger;

    const req = this.request(
      href,
      this.timeout,
      this._onRequestError.bind(this, trigger, 'click')
    );
    const page = this.cache.has(href)
      ? this.cache.get(href)
      : this.cache.set(href, req);

    // Need to wait before getting the right transition
    if (this.transitions.shouldWait) {
      await helpers.updateNext(page, this.data.next);
    }

    // If triggered from an history change (back, forward),
    // simply add the new state without
    if (trigger === 'popstate') {
      this.history.add(href, this.data.next.namespace);
    } else {
      this.history.push(href, this.data.next.namespace);
    }

    const data = this._data;

    // Hook: between trigger and transition
    // Can be used to resolve "route"…
    hooks.do('go', data);

    try {
      const transition = this.transitions.get(data) as ITransitionPage;

      await this.transitions.doPage({
        data,
        page,
        transition,
        wrapper: this._wrapper,
      });

      this._updateTitle(data);
      this._resetData();
    } catch (error) {
      // TODO: !!! infinite loop on transition error???
      this.history.cancel();
      this.logger.error(error);
    }
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

    const href = this.dom.getUrl(link);

    if (this.prevent.checkUrl(href)) {
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
        this._onRequestError.bind(this, link, 'enter')
      ).catch((error: RequestErrorOrResponse) => this.logger.error(error))
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
  }

  /**
   * When History state changes.
   *
   * Get "href" from URL
   * Go for a Barba transition.
   */
  private _onStateChange(): void {
    const href = this.url.getHref();

    this.go(href, 'popstate');
  }

  /**
   * When a request error occurs.
   *
   * Allow the user to manage request error. (E.g: 404)
   */
  private _onRequestError(
    trigger: Trigger,
    action: string,
    ...args: any
  ): boolean {
    const [href, response]: [string, RequestErrorOrResponse] = args;

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
   * Get a valid link ancestor.
   *
   * Check for a "href" attribute.
   * Then check if eligible for Barba.
   */
  private _getLinkElement(e: LinkEvent): HTMLLinkElement {
    let el = e.target as HTMLLinkElement;

    while (el && !this.dom.getUrl(el)) {
      el = (el as HTMLElement).parentNode as HTMLLinkElement;
    }

    // Check prevent
    if (!el || this.prevent.checkLink(el, e, el.href)) {
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
      next: { ...this.schemaPage },
      trigger: undefined,
    };

    hooks.do('reset', this.data);
  }

  /**
   * Update document title.
   */
  private _updateTitle(data: ITransitionData): void {
    const { html } = data.next;
    const { title } = this.dom.toDocument(html);

    document.title = title;
  }
}

const core = new Core();

export default core;
