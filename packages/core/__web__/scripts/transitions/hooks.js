const list = document.querySelector('[data-test="hooks-list"]');

/**
 * Append list item
 *
 * @param {*} str List item content
 * @returns {void}
 */
function append(str) {
  const item = document.createElement('li');

  item.textContent = str;
  list.appendChild(item);
}
export const base = {
  before() {
    append('before');
  },
  beforeLeave() {
    append('beforeLeave');
  },
  leave() {
    append('leave');
  },
  afterLeave() {
    append('afterLeave');
  },
  beforeEnter() {
    append('beforeEnter');
  },
  enter() {
    append('enter');
  },
  afterEnter() {
    append('afterEnter');
  },
  after() {
    append('after');
  },
};

export const hooks = {
  ...base,
  custom: ({ trigger }) =>
    trigger.dataset && trigger.dataset.test === 'link.hooks',
};

export const hooksSync = {
  ...base,
  sync: true,
  custom: ({ trigger }) =>
    trigger.dataset && trigger.dataset.test === 'link.hooks-sync',
};
