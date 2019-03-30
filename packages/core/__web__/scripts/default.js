console.info('🚀 Barba e2e');
import { hooks, hooksSync } from './transitions/hooks.js';

const { barba } = window;

console.info(barba);
barba.init({
  transitions: [hooks, hooksSync],
});
