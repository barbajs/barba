import barba from '@barba/core';
import {
  autoLoad,
} from 'kapla';
import kapla from './kaplaInstance';

// DEV
import router from '@barba/router';

import routes from './transitions/routes';
import defaultTransition from './transitions/default';
import homeToFeature from './transitions/homeToFeature';
import homeToPage from './transitions/homeToPage';
import featureToFeature from './transitions/featureToFeature';
import featureToHome from './transitions/featureToHome';
import featureToPage from './transitions/featureToPage';
import pageToPage from './transitions/pageToPage';
import pageToHome from './transitions/pageToHome';
import pageToFeature from './transitions/pageToFeature';
import onceHome from './transitions/onceHome';
import docToDoc from './transitions/docToDoc';
// import Home from './views/Home';

// Events
import {
  appear,
  raf,
  resize,
  scroll,
} from './events';

/*
 * App Class
 */
class App {
  static start() {
    return new App();
  }

  constructor() {
    Promise.all([App.domReady()]).then(this.init.bind(this));
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
    // Init polyfills
    // polyfills.init();

    // Avoid 'blank page' on JS error
    try {
      // DEV
      barba.use(router, {
        routes,
      });


      barba.init({
        debug: true,
        transitions: [
          defaultTransition,
          homeToFeature,
          // homeToPage,
          featureToFeature,
          featureToHome,
          // featureToPage,
          // pageToHome,
          // pageToFeature,
          // pageToPage,
          docToDoc,
          onceHome,
        ],
      });

      barba.hooks.before(() => {
        document.documentElement.classList.add('transitioning');
      });

      barba.hooks.after(() => {
        document.documentElement.classList.remove('transitioning');
      });

      // Kapla
      const context = require.context(
        './../../layout/components',
        true,
        /\.js$/
      );


      // 1. Register events
      kapla.use('appear', appear);
      kapla.use('raf', raf);
      kapla.use('resize', resize);
      kapla.use('scroll', scroll);

      // 2. Register components
      // Auto loading
      kapla.load(autoLoad(context));
    } catch (err) {
      console.error(err);
    }

    App.showPage();
  }
}

App.start();
