console.log('themes/barba/source/js/main.js');

import { Application, autoLoad } from 'kapla';
import { qs } from './utils/dom';

import Menu from './../../layout/components/_Menu';

// Manual loading
// import MyComponent from 'kapla/MyComponent';

// Events
import {
  appear,
  raf,
  resize,
  scroll,
} from './events';

// DEV
const customEvents = [
  ['somethingCustom', null, false],
];

/*
 * BarbaWebsite Class
 */
class BarbaWebsite {
  static start() {
    return new BarbaWebsite();
  }

  constructor() {
    console.log('BarbaWebsite:constructor');
    Promise
      .all([
        BarbaWebsite.domReady(),
      ])
      .then(this.init.bind(this));
  }

  static domReady() {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  static showPage() {
    document.documentElement.classList.add('ready');
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
    console.info('BarbaWebsite:init');
    // Init polyfills
    // polyfills.init();

    // Avoid 'blank page' on JS error
    try {
      // Kapla
      const context = require.context('./../../layout/components', true, /\.js$/);
      const app = Application.start(qs('.site'));

      // 1. Register events
      customEvents.forEach(events => {
        app.use(...events);
      });
      app.use('appear', appear);
      app.use('raf', raf);
      app.use('resize', resize);
      app.use('scroll', scroll);

      // 2. Register components
      // Auto loading
      app.load(autoLoad(context));
      // Manual loading
      app.register('menu', Menu);

      // Legacy component
      // this.example = new Example();
    } catch (err) {
      console.error(err);
    }

    BarbaWebsite.showPage();
  }
}

BarbaWebsite.start();

