Barba.Pjax.init();
Barba.Prefetch.init();

// Add the active class when click on the menu item.
var menu = document.querySelector('.menu');
var items = menu.querySelectorAll('li');

Barba.Dispatcher.on('linkClicked', function(el) {
  if (!menu.contains(el)) {
    return;
  }

  [].forEach.call(items, function(item) {
    item.classList.remove('active');
  });

  el.parentElement.classList.add('active');
});

// Update Analytics
Barba.Dispatcher.on('initStateChange', function() {
  ga('send', 'pageview', location.pathname);
});
