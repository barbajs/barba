/* eslint-disable newline-before-return */
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

/**
 * Promisify hooks
 *
 * @returns {Promise} Promise
 */
function sleep() {
  return new Promise(resolve => {
    setTimeout(resolve, 100);
  });
}

export const base = {
  beforeOnce() {
    append('beforeOnce');
    return sleep();
  },
  once() {
    append('once');
    return sleep();
  },
  afterOnce() {
    append('afterOnce');
    return sleep();
  },
  before() {
    append('before');
    return sleep();
  },
  beforeLeave() {
    append('beforeLeave');
    return sleep();
  },
  leave() {
    append('leave');
    return sleep();
  },
  afterLeave() {
    append('afterLeave');
    return sleep();
  },
  beforeEnter() {
    append('beforeEnter');
    return sleep();
  },
  enter() {
    append('enter');
    return sleep();
  },
  afterEnter() {
    append('afterEnter');
    return sleep();
  },
  after() {
    append('after');
    return sleep();
  },
};

barba.hooks.beforeOnce(() => {
  append('beforeOnce', 'global:');
});
barba.hooks.once(() => {
  append('once', 'global:');
});
barba.hooks.afterOnce(() => {
  append('afterOnce', 'global:');
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
