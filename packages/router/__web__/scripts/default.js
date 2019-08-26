console.info('🚀 Barba e2e');

const { barba, barbaRouter: router } = window;

const list = document.querySelector('[data-test="logs-list"]');
const routes = [
  {
    name: 'home',
    path: '(/packages/router/__web__/|/packages/router/__web__/index.html)',
  },
  { name: 'page', path: '/packages/router/__web__/page.html' },
];

/**
 * Append list item
 *
 * @param {*} str List item content
 * @param {string} prefix Prefix for global
 * @returns {void}
 */
function append(str, prefix = '') {
  const item = document.createElement('li');

  item.textContent = prefix + str;
  list.appendChild(item);
}

barba.use(router, {
  routes,
});

barba.init({
  debug: true,
  transitions: [
    {
      from: { route: 'home' },
      leave: data => {
        console.info('leave-from', data);
        append('leave-from');

        return Promise.resolve();
      },
      enter: data => {
        console.info('enter-from', data);
        append('enter-from');

        return Promise.resolve();
      },
    },
    {
      to: { route: 'home' },
      leave: data => {
        console.info('leave-to', data);
        append('leave-to');

        return Promise.resolve();
      },
      enter: data => {
        console.info('enter-to', data);
        append('enter-to');

        return Promise.resolve();
      },
    },
  ],
});
