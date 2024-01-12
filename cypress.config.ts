import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: './cypress/fixtures',
  screenshotsFolder: './cypress/screenshots',
  videosFolder: './cypress/videos',
  projectId: 'ngfcig',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8111/packages/',
    specPattern: './packages/**/__e2e__/**/*.spec.js',
  },
})
