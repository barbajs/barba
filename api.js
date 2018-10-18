import barba from 'barba.js';

// Views
// we can also get the view name by .prototype.constructor.name
// no more view init. The views are always already-defined before barba.init()
class Home {
  beforeEenter() {}
  enter() {}
  afterEnter() {}

  beforeLeave() {}
  leave() {}
  afterLeave() {}
}

// Transition - just a plain function!
const fade = (done, oldPage, newPagePromise) => {
  oldPage.fadeOut();
  newPagePromise.then(p => p.fadeIn().then(done));
};

// Init
barba.init({
  wrapper: 'wrapper', // data-wrapper name
  container: 'container', // data-container name
  cache: true,
  prefetch: false,
  transition: (current, previous, trigger) => fade, // it's a function returning a function, so you can have your logic here.
  views: {
    Home,
    About,
  }, // in this way, you can still use plain ES5 objects as view
});

// Edge case that are possible with a custom `transition` function:
// Use specific transition based on screen size?

// `transition` function can be async, it can wait the new container? and then decide once you have prev/next views/namespaces?

// Events
barba.on('pageReady', () => {});

// Access to Cache
barba.cache; // { url: 'responseHTML' ... }

// Access to History
barba.history; // [{..}, {..}]
barba.current; // { url: 'http://', view: 'home' }
barba.previous; // { url: 'http://', view: 'about' }

// Destroy
barba.destroy();
