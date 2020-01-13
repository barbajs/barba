/* eslint-disable no-magic-numbers */
/*
 * Dependencies
 */
const enquire = require('vendor/enquire');
const breakpoints = require('./breakpoints.json');

// Convert pixel values to em values (based on 1em = 16px)
const px2em = function px2em(px) {
  const value = parseInt(px.replace('px', ''), 10);

  return `${Math.round(value / 16)}em`;
};

// Convert pixel values to em values - 0.01em
// (for max-width breakpoints, mobile first)
const px2emMax = function px2emMax(px) {
  const em = px2em(px);
  const value = em.replace('em', '');

  return `${parseInt(value, 10) - 0.01}em`;
};

/**
 * Register breakpoints for media queries detection
 * @export
 * @param  {string} minWidth  breakpoint label
 * @param  {string} maxWidth  breakpoint label for max-width (min AND max)
 * @param  {object} actions   map with enquire.js
 * "actions" (match|unmatch|setup|deferSetup|destroy)
 * and associated values (function|boolean[deferSetup])
 * @return {void}
 */
export function register(minWidth, ...args) {
  let maxWidth;
  let actions;
  let mq;
  const i = 0;
  const j = 1;

  mq = `screen and (min-width:${breakpoints[minWidth]})`;

  if (typeof args[i] === 'string') {
    maxWidth = args[i];
    actions = args[j];
    mq += ` and (max-width:${px2emMax(breakpoints[maxWidth])})`;
  } else {
    maxWidth = false;
    actions = args;
  }
  enquire.register(mq, actions);
}

/**
 * Unegister handler for breakpoints
 * @export
 * @param  {string} minWidth  breakpoint label
 * @param  {Function} handler  handler to unregister
 * @param  {string} maxWidth  breakpoint label for max-width (min AND max)
 * @param  {object} actions   map with enquire.js
 * "actions" (match|unmatch|setup|deferSetup|destroy)
 * and associated values (function|boolean[deferSetup])
 * @return {void}
 */
export function unregister(minWidth, handler, ...args) {
  let maxWidth;
  // !DEV unused?
  // let actions;
  let mq;
  const i = 0;
  // !DEV
  // const j = 1;

  mq = `screen and (min-width:${breakpoints[minWidth]})`;

  if (typeof args[i] === 'string') {
    maxWidth = args[i];
    // !DEV unused?
    // actions = args[j];
    mq += ` and (max-width:${px2emMax(breakpoints[maxWidth])})`;
  } else {
    maxWidth = false;
    // !DEV unused?
    // actions = args[i];
  }

  enquire.unregister(mq, handler);
}

/**
 * Check if viewport width is more than breakpoint
 *
 * @export
 * @param {String} label breakpoint
 * @returns {Boolean} true if greater than or equal to
 */
export function isMoreThan(label) {
  const size = parseInt(breakpoints[label], 10);

  return window.innerWidth >= size;
}

/**
 * Check if viewport width is less than breakpoint
 *
 * @export
 * @param {String} label breakpoint
 * @returns {Boolean} true if less than
 */
export function isLessThan(label) {
  const size = parseInt(breakpoints[label], 10);

  return window.innerWidth < size;
}
