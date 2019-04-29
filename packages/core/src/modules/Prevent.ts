/**
 * @barba/core/modules/prevent
 * <br><br>
 * ## Prevent checks.
 *
 * - Gathers all the tests that allow Barba to work and play transitions
 *
 * @module core/modules/prevent
 * @preferred
 */

/***/

// Definitions
import { IgnoreOption, PreventCheck } from '../defs';
// Schemas
import { schemaAttribute } from '../schemas/attribute';
// Utils
import { url } from '../utils';
// Modules
import { Ignore } from './Ignore';

/**
 * Make sure the browser supports `history.pushState`.
 */
const pushState: PreventCheck = () => !window.history.pushState;

/**
 * Make sure there is an `el` and `href`.
 */
const exists: PreventCheck = ({ el, href }) => !el || !href;

/**
 * If the user is pressing ctrl + click, the browser will open a new tab.
 */
const newTab: PreventCheck = ({ event }) =>
  (event as KeyboardEvent).which > 1 ||
  (event as KeyboardEvent).metaKey ||
  (event as KeyboardEvent).ctrlKey ||
  (event as KeyboardEvent).shiftKey ||
  (event as KeyboardEvent).altKey;

/**
 * If the link has `_blank` target.
 */
const blank: PreventCheck = ({ el }) =>
  el.hasAttribute('target') && (el as HTMLLinkElement).target === '_blank';

/**
 * If the domain is the same (in order to avoid pushState cross origin security problem).
 */
const corsDomain: PreventCheck = ({ el }) =>
  window.location.protocol !==
    ((el as unknown) as HTMLHyperlinkElementUtils).protocol ||
  window.location.hostname !==
    ((el as unknown) as HTMLHyperlinkElementUtils).hostname;

/**
 * If the port is the same.
 */
const corsPort: PreventCheck = ({ el }) =>
  url.getPort() !==
  url.getPort(((el as unknown) as HTMLHyperlinkElementUtils).port);

/**
 * If the link has download attribute.
 */
const download: PreventCheck = ({ el }) =>
  el.getAttribute && typeof el.getAttribute('download') === 'string';

/**
 * If the links contains [data-barba-prevent] or [data-barba-prevent="self"].
 */
const preventSelf: PreventCheck = ({ el }) =>
  el.hasAttribute(`${schemaAttribute.prefix}-${schemaAttribute.prevent}`);

/**
 * If some link ancestor contains [data-barba-prevent="all"].
 */
const preventAll: PreventCheck = ({ el }) =>
  Boolean(
    el.closest(`[${schemaAttribute.prefix}-${schemaAttribute.prevent}="all"]`)
  );

/**
 * If the link is the current URL.
 *
 * > Not in the test suite.
 */
const sameUrl: PreventCheck = ({ href }) =>
  // DEV
  // url.getPath(href) === url.getPath(window.location.href);
  url.clean(href) === url.clean(window.location.href);

export class Prevent extends Ignore {
  public suite: string[] = [];
  public tests: Map<string, PreventCheck> = new Map();

  constructor(ignore: IgnoreOption) {
    super(ignore);
    this.init();
  }

  public init(): void {
    // Add defaults
    this.add('pushState', pushState);
    this.add('exists', exists);
    this.add('newTab', newTab);
    this.add('blank', blank);
    this.add('corsDomain', corsDomain);
    this.add('corsPort', corsPort);
    this.add('download', download);
    this.add('preventSelf', preventSelf);
    this.add('preventAll', preventAll);

    // Outside of the test suite
    this.add('sameUrl', sameUrl, false);
  }

  public add(name: string, check: PreventCheck, suite: boolean = true): void {
    this.tests.set(name, check);
    suite && this.suite.push(name);
  }

  /**
   * Run individual test
   */
  public run(
    name: string,
    el: HTMLLinkElement,
    event: Event,
    href: string
  ): boolean {
    return this.tests.get(name)({
      el,
      event,
      href,
    });
  }

  /**
   * Run test suite
   */
  public checkLink(el: HTMLLinkElement, event: Event, href: string): boolean {
    return this.suite.some(name => this.run(name, el, event, href));
  }
}
