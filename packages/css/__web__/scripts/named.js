console.info('🚀 Barba e2e');

const { barba, barbaCss: css } = window;

barba.use(css);
barba.init({
  transitions: [{ name: 'named' }],
});
