console.info('🚀 Barba e2e');

const { barba, barbaCss: css } = window;

barba.use(css, { debug: true });
barba.init({ debug: true });
