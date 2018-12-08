import { cleanLink, getPort } from './utils';

/**
 * Prevent tests
 *
 * If check is true, barba is not actionated.
 * Tests receives { el, event, href }
 *
 * @namespace @barba/core/prevent
 * @type {object}
 */
const prevent = {
  /**
   * Tests by name
   *
   * @memberof @barba/core/prevent
   * @type {array}
   * @private
   */
  _tests: {},

  /**
   * Init prevent
   *
   * @memberof @barba/core/prevent
   * @param {object} { attributeSchema } options
   * @returns {undefined}
   */
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
    // this.add(
    //   'sameUrl',
    //   ({ href }) => cleanLink(href) === cleanLink(window.location.href)
    // );

    // If contains [data-barba="prevent"]
    this.add(
      'hasAttr',
      ({ el }) => el.getAttribute(this.attr.prefix) === this.attr.prevent
    );
  },

  /**
   * Add test
   *
   * @memberof @barba/core/prevent
   * @param {string} id test name
   * @param {function} check test function
   * @returns {undefined}
   */
  add(id, check) {
    // #TODO: check for existing test
    this._tests[id] = check;
  },

  /**
   * Run tests
   *
   * @memberof @barba/core/prevent
   * @param {HTMLElement} el trigger element
   * @param {Event} event triggered event
   * @param {string} href target url
   * @returns {boolean} prevent if some test returns true
   */
  check(el, event, href) {
    return Object.keys(this._tests).some(id =>
      this._tests[id]({
        el,
        event,
        href,
      })
    );
  },

  // TODO: outside of global tests to avoid hard refresh on same URL
  // Can be discussed
  sameUrl(href) {
    return cleanLink(href) === cleanLink(window.location.href);
  },
};

export default prevent;
