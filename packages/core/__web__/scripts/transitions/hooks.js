const { barba } = window;
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
export const base = {
  beforeAppear() {
    append('beforeAppear');
  },
  appear() {
    append('appear');
  },
  afterAppear() {
    append('afterAppear');
  },
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

barba.hooks.beforeAppear(() => {
  append('beforeAppear', 'global:');
});
barba.hooks.appear(() => {
  append('appear', 'global:');
});
barba.hooks.afterAppear(() => {
  append('afterAppear', 'global:');
});
barba.hooks.before(() => {
  append('before', 'global:');
});
barba.hooks.beforeLeave(() => {
  append('beforeLeave', 'global:');
});
barba.hooks.leave(() => {
  append('leave', 'global:');
});
barba.hooks.afterLeave(() => {
  append('afterLeave', 'global:');
});
barba.hooks.beforeEnter(() => {
  append('beforeEnter', 'global:');
});
barba.hooks.enter(() => {
  append('enter', 'global:');
});
barba.hooks.afterEnter(() => {
  append('afterEnter', 'global:');
});
barba.hooks.after(() => {
  append('after', 'global:');
});

export const hooks = {
  ...base,
  custom: ({ trigger }) =>
    trigger === 'barba' ||
    (trigger.dataset && trigger.dataset.test === 'link.hooks'),
};

export const hooksSync = {
  ...base,
  sync: true,
  custom: ({ trigger }) =>
    trigger.dataset && trigger.dataset.test === 'link.hooks-sync',
};
