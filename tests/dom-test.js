describe('Dom', function() {
  var dom = Barba.Pjax.Dom;
  var fakePage = "<html> \
    <head> \
      <title>titlepage</title> \
    </head> \
    <body> \
      <div id='custom-barba-wrapper'> \
        <div class='custom-barba-container' data-customnamespace='test'> \
          <h1>content</h1> \
        </div> \
      </div> \
    </body> \
  </html>";

  var container;

  dom.dataNamespace = 'customnamespace';
  dom.wrapperId = 'custom-barba-wrapper';
  dom.containerClass = 'custom-barba-container';

  it('should exists', function() {
    expect(dom).toBeTruthy();
  });

  it('should be able to parse the dom', function() {
    container = dom.parseResponse(fakePage);
    var text = container.querySelector('h1').textContent;

    expect(text).toBe('content');
    expect(document.title).toBe('titlepage');
  });

  it('should be able to get the namespace', function() {
    var namespace = dom.getNamespace(container);

    expect(dom.getNamespace()).toBeFalsy();
    expect(namespace).toBe('test');
  });

  it('should have a default currentHTML', function() {
    var html = dom.currentHTML;

    expect(html).toBeTruthy();
    expect(html).toContain('titlepage');
  });
});
