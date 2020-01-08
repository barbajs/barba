Barba.Pjax.init();
Barba.Prefetch.init();

var menu = document.querySelector('.menu');
var items = menu.querySelectorAll('li');
var wrapper = document.getElementById('barba-wrapper');

// Add the active class when click on the menu item.
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

// Scroll to the wrapper
Barba.Dispatcher.on('transitionCompleted', function() {
  window.scrollTo(0, wrapper.getBoundingClientRect().top);
});
