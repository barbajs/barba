console.info('🚀 Barba e2e');
import { home, page } from './views/hooks.js';

const { barba } = window;

barba.init({
  debug: true,
  views: [home, page],
});
