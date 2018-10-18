const prevent = {
  tests: {},

  add(id, check) {
    this.tests[id] = check;
  },

  check(el, event, href) {},
};

/*
{
  element,
  event,
  href
}
*/

// if check is true, barba is not actionated.

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
  ({ element }) => element.target && element.target === '_blank'
);

// Check if the domain is the same (in order to avoid pushState cross origin security problem)
prevent.add('corsDomain', ({ element }) => {
  return (
    window.location.protocol !== element.protocol ||
    window.location.hostname !== element.hostname
  );
});

// Check the port
prevent.add('corsPort', ({ element }) => {
  return Utils.getPort() !== Utils.getPort(element.port);
});

// Check download attribute
prevent.add('download', ({ element }) => {
  return (
    element.getAttribute && typeof element.getAttribute('download') === 'string'
  );
});

// Check same url
prevent.add('sameUrl', ({ href }) => {
  return Utils.cleanLink(href) == Utils.cleanLink(window.location.href);
});

// If contains no-barba class
prevent.add('noBarba', ({ element }) => {
  return element.classList.contains('no-barba');
});

export default prevent;
