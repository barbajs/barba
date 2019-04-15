console.info('🚀 Barba e2e');
import { hooks, hooksSync } from './transitions/hooks.js';

const { barba } = window;

barba.init({
  debug: true,
  transitions: [hooks, hooksSync],
});
