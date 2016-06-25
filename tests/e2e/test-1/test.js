module.exports = {
  'Basic test' : function (browser) {
    browser
      .url(browser.globals.baseUrl + '/tests/e2e/test-1/index.html')
      .expect.element('#barba-wrapper').to.have.attribute('aria-live').equals('polite');

    browser
      .assert.title('home')
      .assert.urlContains('index.html')
      .assert.cssClassPresent('body', 'home');

    browser
      .click('a[href="about.html"]')
      .pause(1000);

    browser
      .assert.title('about')
      .assert.urlContains('about.html')
      .assert.cssClassPresent('body', 'about');

    browser.end();
  }
};
