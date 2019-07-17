/* eslint-disable newline-before-return */
const list = document.querySelector('[data-test="hooks-list"]');

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

export const home = {
  namespace: 'home',
  beforeLeave() {
    append('beforeLeave');
  },
  afterLeave() {
    append('afterLeave');
  },
  beforeEnter() {
    append('beforeEnter');
  },
  afterEnter() {
    append('afterEnter');
  },
};

export const page = {
  namespace: 'page',
  beforeLeave() {
    append('beforeLeave');
  },
  afterLeave() {
    append('afterLeave');
  },
  beforeEnter() {
    append('beforeEnter');
  },
  afterEnter() {
    append('afterEnter');
  },
};
