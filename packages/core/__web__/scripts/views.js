console.info('🚀 Barba e2e');
import { home, page } from './views/hooks.js';

const { barba } = window;

// const list = document.querySelector('[data-test="hooks-list"]');

// /**
//  * Append list item
//  *
//  * @param {*} str List item content
//  * @param {string} prefix Prefix for global
//  * @returns {void}
//  */
// function append(str, prefix = '') {
//   const item = document.createElement('li');

//   item.textContent = prefix + str;
//   list.appendChild(item);
// }

// barba.hooks.beforeEnter(() => {
//   console.info('global.beforeEnter');
//   append('global.beforeEnter');
// });
// barba.hooks.afterEnter(() => {
//   console.info('global.afterEnter');
//   append('global.afterEnter');
// });

barba.init({
  debug: true,
  views: [home, page],
});
