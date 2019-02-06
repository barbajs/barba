console.info('🚀 Barba e2e');

const { barba, 'barba-css': css } = window;

barba.use(css);
barba.init({
  transitions: [{ name: 'named' }],
});
