☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠
# Use at your own risk, still work in progress
☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠

# barba.js
-----
*barba.js* it's a small, flexible and dependency free library that helps you creating fluid and smooth transition between your website's pages.

It helps reducing delay between your pages, minimizing browser HTTP requests and enhancing your user's web experience.

# Main features
-----
- Pjax
- Transitions
- Views
- Cache
- Mousehover prefetch

# Installation
-----
*barba.js* supports **AMD**, **CommonJS** and **Browser global** (it uses [UMD](https://github.com/umdjs/umd))

You can install it using [npm](https://www.npmjs.com): `npm install barba.js --save-dev` (not available yet)

or just including the script in your page:
```
<script src="barba.min.js" type="text/javascript"></script>
```

*barba.js* needs to know a little bit about your DOM structure.
By default uses this markup structure in your pages:
```
<div id="barba-wrapper">
  <div class="barba-container">
    ...your main page...
  </div>
</div>
```

# Usage
-----
After you've included barba.js in your project, it's enough to call
```javascript
//Please note, the DOM should be ready
Barba.Pjax.start();
```

When the link is clicked, barba.js do a couple of things, let's see them briefly:
1.  See if it's a valid link (through `Barba.Pjax.preventCheck`), if yes, the link will be prevented, otherwise, the browser will follow the link normally
2. Change the URL with the new one (using [pushstate](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState))
3. Start fetching the new page with ajax
4. Start a transition instance
5. As soon the new page is loaded, barba.js parses the new HTML (taking `.barba-container`)  and put the new content on the DOM (inside `#barba-wrapper`).
6. The transition instance will take care to hide the old container and show the new one


# Events
-----
During a page change, *barba.js* fires some events (with relative arguments):
1. `linkClicked` - ( event)
2. `initStateChange` - (currentStatus)
3. `newPageReady` - (currentStatus, prevStatus)
4. `transitionCompleted` - (currentStatus, prevStatus)

To listen an event, it's enough:
```javascript
Barba.Dispatcher.on(eventName, function() {
  //your listener
});
```
# Transitions
-----
This is probably the coolest feature of *barba.js*.

By default Barba uses a HideShow transition, but you can create custom transitions, 
as example, let's create a FadeTransition using jquery .animate() - Of course you can use any JS library/plain javascript/css transitions and more.

```javascript
var FadeTransition = Barba.BaseTransition.extend({
  start: function() {
    /**
     * This function is automatically called as soon the Transition starts
     * this.newContainerLoading is a Promise for the loading of the new container
     * (Barba.js also comes with an handy Promise polyfill!)
     */
    
    // As soon the loading is finished and the old page is faded out, let's fade the new page
    Promise
      .all([this.newContainerLoading, this.fadeOut()])
      .then(this.fadeIn.bind(this));
  },

  fadeOut: function() {
    /**
     * this.oldContainer is the HTMLElement of the old Container
     */

    return $(this.oldContainer).animate({ opacity: 0 }).promise();
  },

  fadeIn: function() {
    /**
     * this.newContainer is the HTMLElement of the new Container
     * At this stage newContainer is on the DOM (inside our #barba-container and with display: none)
     * Please note, newContainer is available just after newContainerLoading is resolved!
     */

    var _this = this;
    var $el = $(this.newContainer);

    $(this.oldContainer).hide();

    $el.css({
      display : 'block',
      opacity : 0
    });

    $el.animate({ opacity: 1 }, 400, function() {
      /**
       * Do not forget to call .done() as soon your transition is finished!
       * .done() will automatically remove from the DOM the old Container
       */

      _this.done();
    });
  }
});

/**
 * Next step, you have to tell Barba to use the new Transition
 */

Barba.Pjax.getTransition = function() {
  /**
   * Here you can use your own logic!
   * For example you can use different Transition based on the current page or link...
   */

  return FadeTransition;
};
```

# Views
-----
One of the hardest things with a pushstate navigation is to handle and takes care of all the javascript states/events in the different pages.

For example, the homepage page could have a fullscreen slider with touch/scroll preventdefault, while an internal page do not need that.

To associate a `View` with a `container`, it's enough to specify a common namespace:
```
<div class="barba-container" data-namespace="homepage">
```

```javascript
var Homepage = Barba.BaseView.extend({
    namespace: 'homepage',
    onEnter: function() {
        // The new Container is ready and attached to the DOM.
    },
    onEnterCompleted: function() {
        // The transition has just finished.
    },
    onLeave: function() {
        // A new transition toward a new page has just started.
    },
    onLeaveCompleted: function() {
        // The container has just been removed from the DOM.
    }
});
//Don't forget to init the view!
Homepage.init();
```
# Cache
-----
By default *barba.js* uses a simple Cache to save pages, in this way if the user navigate to a page already visited, there will be no xhr call.

You can access to the cache through the object `Barba.Pjax.Cache` or disabling it setting `Barba.Pjax.cacheEnabled` as `false`.

The actual Cache is a plain javascript obejct, and it's destroyed at the user's browser refresh.

In the future is also planned to create a more permanent cache based on `LocalStorage`

# Browser support
-----
In order to work, *barba.js* needs [pushstate](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState), so it works in all almost all the recent browsers. Have a look on [canisue.com](http://caniuse.com/#search=pushstate) for more detailed information.

# FAQ
-----
- *I want to ignore barba.js on some links*
    - You can just add the class `.no-barba`, or add you own check logic replacing the function `Barba.Pjax.preventCheck`

- How can I update Google Analytics (or any other tracking sytem?)
    - It's enough to listen the event... and...

# License
-----
*barba.js* is released under **MIT License**

# Contribute
-----
Any help is more than welcome.  
For any problem/question do not hesitate to open an issue.

# Thanks to
-----

- [@taylorhakes](https://github.com/taylorhakes) - for his [promise-polyfill](https://github.com/taylorhakes/promise-polyfill)
- [@danielemeli](https://twitter.com/danielemeli) - for the name idea :)

# TO DO
-----
- Test with backend partial output
- Make mousehover prefetch with vanilla js
- Localstorage cache
- CSS Transition
- Better DOC
- Make demos
