import { cleanLink, getPort } from './utils';

const prevent = {
  tests: {},

  add(id, check) {
    // #TODO: check for existing test
    this.tests[id] = check;
  },

  check(el, event, href) {
    return Object.keys(this.tests).some(id =>
      this.tests[id]({
        el,
        event,
        href,
      })
    );
  },
};

/**
 * Prevent tests
 *
 * If check is true, barba is not actionated.
 * Test receives { el, event, href }
 */

// Make sure the browser supports pushstate
prevent.add('pushState', () => !window.history.pushState);

// Make sure there is an el and href
prevent.add('exists', ({ el, href }) => !el || !href);

// If the user is pressing ctrl + click the browser will open a new tab
prevent.add(
  'newTab',
  ({ event }) =>
    event.which > 1 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
);

// Blank target
prevent.add(
  'blank',
  ({ el }) => el.hasAttribute('target') && el.target === '_blank'
);

// Check if the domain is the same (in order to avoid pushState cross origin security problem)
prevent.add(
  'corsDomain',
  ({ el }) =>
    window.location.protocol !== el.protocol ||
    window.location.hostname !== el.hostname
);

// Check the port
prevent.add('corsPort', ({ el }) => getPort() !== getPort(el.port));

// Check download attribute
prevent.add(
  'download',
  ({ el }) => el.getAttribute && typeof el.getAttribute('download') === 'string'
);

// Check same url
prevent.add(
  'sameUrl',
  ({ href }) => cleanLink(href) === cleanLink(window.location.href)
);

// If contains no-barba class
prevent.add('noBarba', ({ el }) => el.classList.contains('no-barba'));

export default prevent;
