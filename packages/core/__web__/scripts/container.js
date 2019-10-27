/* eslint-disable no-empty-function */
console.info('🚀 Barba e2e');

const { barba } = window;

barba.init({
  debug: true,
  transitions: [
    {
      leave() {},
      enter() {},
    },
    {
      sync: true,
      custom: ({ trigger }) =>
        trigger.dataset && trigger.dataset.barbaTest === 'link.sync',
      leave() {},
      enter() {},
    },
  ],
});
