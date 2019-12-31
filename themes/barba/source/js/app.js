import {
  Application,
} from 'kapla';

class App {
  constructor() {
    return Application.start();
  }
}

const instance = new App();

/**
 * Get Kapla instance from DOM element.
 *
 * @param {HTMLElement} parent DOM parent
 * @param {string} name Component name
 * @returns {Component} Kapla component instance
 */
export function getInstance(parent, name) {
  const el = parent.querySelector(`[data-component="${name}"]`);

  return instance.instanceByElement(el);
}

export default instance;
