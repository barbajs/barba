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
  ],
});
