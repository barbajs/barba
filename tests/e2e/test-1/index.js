module.exports = {
  'Demo test' : function (browser) {
    browser
      .url(browser.globals.baseUrl + '/tests/e2e/test-1/index.html')
      .assert.title('title1')
      .end();
  }
};
