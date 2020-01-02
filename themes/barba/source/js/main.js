import barba from '@barba/core'
import router from '@barba/router'
import { autoLoad } from 'kapla'
import kapla from './app'

import routes from './transitions/routes'
import defaultTransition from './transitions/default'
import homeToFeature from './transitions/homeToFeature'
import featureToFeature from './transitions/featureToFeature'
import featureToHome from './transitions/featureToHome'
import docToDoc from './transitions/docToDoc'
import onceHome from './transitions/onceHome'
import onceFeature from './transitions/onceFeature'
// DEV
// import homeToPage from './transitions/homeToPage'
// import featureToPage from './transitions/featureToPage'
// import pageToPage from './transitions/pageToPage'
// import pageToHome from './transitions/pageToHome'
// import pageToFeature from './transitions/pageToFeature'
// Views are not really needed with Kapla…
// import Home from './views/Home';

// Events
import { appear, raf, resize, scroll } from './events'

/*
 * Main Class
 */
class Main {
  static start() {
    return new Main()
  }

  constructor() {
    Promise.all([Main.domReady()]).then(this.init.bind(this))
  }

  static domReady() {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve)
    })
  }

  static showPage() {
    document.documentElement.classList.add('ready')
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
      })

      barba.init({
        debug: true,
        transitions: [
          defaultTransition,
          homeToFeature,
          featureToFeature,
          featureToHome,
          docToDoc,
          onceHome,
          onceFeature,
          // DEV
          // homeToPage,
          // featureToPage,
          // pageToHome,
          // pageToFeature,
          // pageToPage,
        ],
      })

      barba.hooks.before(() => {
        document.documentElement.classList.add('is-transitioning')
      })

      barba.hooks.after(() => {
        document.documentElement.classList.remove('is-transitioning')
      })

      // Kapla
      const context = require.context(
        './../../layout/components',
        true,
        /\.js$/
      )

      // 1. Register events
      kapla.use('appear', appear)
      kapla.use('raf', raf)
      kapla.use('resize', resize)
      kapla.use('scroll', scroll)

      // 2. Register components
      // Auto loading
      kapla.load(autoLoad(context))
    } catch (err) {
      console.error(err)
    }

    Main.showPage()
  }
}

Main.start()
