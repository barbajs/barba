import { cleanLink, getPort } from './utils';

/**
 * Prevent tests
 *
 * If check is true, barba is not actionated.
 * Test receives { el, event, href }
 */
const prevent = {
  tests: {},

  init({ attributeSchema }) {
    this.attr = attributeSchema;

    // Add defaults
    // Make sure the browser supports pushstate
    this.add('pushState', () => !window.history.pushState);

    // Make sure there is an el and href
    this.add('exists', ({ el, href }) => !el || !href);

    // If the user is pressing ctrl + click the browser will open a new tab
    this.add(
      'newTab',
      ({ event }) =>
        event.which > 1 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    );

    // Blank target
    this.add(
      'blank',
      ({ el }) => el.hasAttribute('target') && el.target === '_blank'
    );

    // Check if the domain is the same (in order to avoid pushState cross origin security problem)
    this.add(
      'corsDomain',
      ({ el }) =>
        window.location.protocol !== el.protocol ||
        window.location.hostname !== el.hostname
    );

    // Check the port
    this.add('corsPort', ({ el }) => getPort() !== getPort(el.port));

    // Check download attribute
    this.add(
      'download',
      ({ el }) =>
        el.getAttribute && typeof el.getAttribute('download') === 'string'
    );

    // Check same url
    this.add(
      'sameUrl',
      ({ href }) => cleanLink(href) === cleanLink(window.location.href)
    );

    // If contains no-barba class
    this.add(
      'noBarba',
      ({ el }) =>
        el.classList.contains('no-barba') ||
        el.getAttribute(this.attr.prefix) === this.attr.prevent
    );
  },

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

export default prevent;
