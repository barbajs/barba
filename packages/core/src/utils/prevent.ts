/**
 * @module core/utils/prevent
 */
import { Prevent } from '../defs/utils';
import { SchemaAttribute } from '../defs/schemas';
import { PreventCheck } from '../defs/shared';
// ---
import { schemaAttribute } from '../schemas';
import { url } from '.';

const _attr: SchemaAttribute = schemaAttribute;
const _tests: Map<string, Function> = new Map();
const _suite: string[] = [];

function add(name: string, check: PreventCheck, suite: boolean = true) {
  _tests.set(name, check);
  suite && _suite.push(name);
}

// Add defaults
// Make sure the browser supports pushstate
add('pushState', () => !window.history.pushState);

// Make sure there is an el and href
add('exists', ({ el, href }) => !el || !href);

// If the user is pressing ctrl + click the browser will open a new tab
add(
  'newTab',
  ({ event }) =>
    (event as KeyboardEvent).which > 1 ||
    (event as KeyboardEvent).metaKey ||
    (event as KeyboardEvent).ctrlKey ||
    (event as KeyboardEvent).shiftKey ||
    (event as KeyboardEvent).altKey
);

// Blank target
add(
  'blank',
  ({ el }) =>
    el.hasAttribute('target') && (el as HTMLLinkElement).target === '_blank'
);

// Check if the domain is the same (in order to avoid pushState cross origin security problem)
add(
  'corsDomain',
  ({ el }) =>
    window.location.protocol !==
      ((el as unknown) as HTMLHyperlinkElementUtils).protocol ||
    window.location.hostname !==
      ((el as unknown) as HTMLHyperlinkElementUtils).hostname
);

// Check the port
add(
  'corsPort',
  ({ el }) =>
    url.getPort() !==
    url.getPort(((el as unknown) as HTMLHyperlinkElementUtils).port)
);

// Check download attribute
add(
  'download',
  ({ el }) => el.getAttribute && typeof el.getAttribute('download') === 'string'
);

// If contains [data-barba-prevent] or [data-barba-prevent="self"]
add('preventSelf', ({ el }) =>
  el.hasAttribute(`${_attr.prefix}-${_attr.prevent}`)
);

// If ancestor contains [data-barba-prevent="all"]
add('preventAll', ({ el }) =>
  Boolean(el.closest(`[${_attr.prefix}-${_attr.prevent}="all"]`))
);

// Check for same URL
add(
  'sameUrl',
  ({ href }) => url.getPath(href) === url.getPath(window.location.href),
  false
);

/**
 * Prevent tests
 *
 * If check is true, barba is not actionated.
 * Tests receives { el, event, href }
 */
const prevent: Prevent = {
  /**
   * Add test
   */
  add(name, check, suite = true) {
    add(name, check, suite);
  },

  /**
   * Run individual test
   */
  run(name, el, event, href) {
    return _tests.get(name)({
      el,
      event,
      href,
    });
  },
  /**
   * Run test suite
   */
  check(el, event, href) {
    return _suite.some(name => this.run(name, el, event, href));
  },
};

export { prevent };
