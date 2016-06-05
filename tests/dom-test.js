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

  it('exists', function() {
    expect(dom).toBeTruthy();
  });

  it('.parseResponse', function() {
    container = dom.parseResponse(fakePage);
    var text = container.querySelector('h1').textContent;

    expect(text).toBe('content');
    expect(document.title).toBe('titlepage');
  });

  it('.getNamespace', function() {
    var namespace = dom.getNamespace(container);

    expect(dom.getNamespace()).toBeFalsy();
    expect(namespace).toBe('test');
  });
});
