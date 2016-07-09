<p align="center"><a href="http://barbajs.org" target="_blank"><img width="300" src="http://barbajs.org/images/logo.svg"></a></p>

<p align="center">
<a href="https://gitter.im/luruke/barba.js"><img src="https://badges.gitter.im/luruke/barba.js.svg" /></a>
<a href='https://travis-ci.org/luruke/barba.js'><img src='https://travis-ci.org/luruke/barba.js.svg?branch=master' alt='Build Status' /></a>
<a href='https://coveralls.io/github/luruke/barba.js?branch=master'><img src='https://coveralls.io/repos/github/luruke/barba.js/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>
---

*barba.js* is a small *(4kb minified and gzipped)*, flexible and dependency free library that helps you creating fluid and smooth transitions between your website's pages.

It helps reducing the delay between your pages, minimizing browser HTTP requests and enhancing your user's web experience.

---
## Websites using Barba.js
<a href="https://www.stanleystella.com" target="_blank"><img src="http://barbajs.org/images/1.gif" width="288"></a>
<a href="http://www.poigneedemainvirile.com" target="_blank"><img src="http://barbajs.org/images/2.gif" width="288"></a>
<a href="http://www.budidiokojinedostaje.hr" target="_blank"><img src="http://barbajs.org/images/3.gif" width="288"></a>
<a href="http://magacom.fr" target="_blank"><img src="http://barbajs.org/images/4.gif" width="288"></a>
<a href="http://adrenalinmedia.com.au" target="_blank"><img src="http://barbajs.org/images/5.gif" width="288"></a>

[View demos](http://barbajs.org/demos.html)

## How it works

Barba.js uses *PJAX* (aka push state ajax) to enhance the user's experience.

This technique consist in preventing the normal link behavior, changing manually the browser url, and injecting manually the new content in the page. In this way there will be no browser *"hard refresh"*.

Here is a walkthrough of what happens when the user clicks a link:

1.  Check if the link is valid and eligible for *PJAX*, if yes, prevent the normal browser behavior.
2.  Change the URL using [Push State API](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState).
3.  Start fetching the new page via `XMLHttpRequest`.
4.  Create a **new** [transition](http://barbajs.org/transition.html) instance.
5.  As soon the new page is loaded, barba.js parses the new HTML (taking `.barba-container`) and puts the new content on the DOM inside `#barba-wrapper`.
6.  The [transition](http://barbajs.org/transition.html) instance will take care to hide the old container and show the new one.
7.  As soon the transition is finished, the old container is removed from the DOM.

> Please note, on server side, your pages will need to be served normally.   
> Barba.js works as ehnancement for your website, everything should work normally without Javascript.

In order to have a better understanding on how Barba.js works I suggest you to read this [article](https://www.smashingmagazine.com/2016/07/improving-user-flow-through-page-transitions/) I wrote for Smashing Magazine.

## Why?

Using this technique will bring numerous benefits:

*   Possibility to create nice transition between pages enhancing the user's experience.
*   Reduce HTTP requests. (why reload the css/js at each page change?)
*   Possibility to speed up the navigation using [prefetch](http://barbajs.org/prefetch.html) and [cache](http://barbajs.org/cache.html).

## Features

- [Pjax](http://barbajs.org/how-it-works.html)
- [Transitions](http://barbajs.org/transition.html)
- [Views](http://barbajs.org/views.html)
- [Events](http://barbajs.org/events.html)
- [Cache](http://barbajs.org/cache.html)
- [Prefetch](http://barbajs.org/prefetch.html)

## Installation

**barba.js** supports AMD, CommonJS and Browser global (using UMD).   
You can install it using npm:   
```
npm install barba.js --save-dev
```
or just including the script in your page:   
```html
<script src="barba.min.js" type="text/javascript"></script>
```
or you can use [cdnjs](https://cdnjs.com/libraries/barba.js):   
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/barba.js/0.0.10/barba.min.js" type="text/javascript"></script>
```

barba.js needs to know a little bit about your DOM structure. By default uses this markup structure in your pages:

```html
<div id="barba-wrapper">
  <div class="barba-container">
    ...Put here the content you wish to change between pages...
  </div>
</div>
```

> Please note, all the selector (#barba-wrapper, .barba-container) are easily editable, see the API section.

After you've included barba.js in your project it's time to initialize it

```javascript
// Please note, the DOM should be ready
Barba.Pjax.start();
```
## Contribute

Barba.js is created in the spare time by [Luigi De Rosa](https://twitter.com/luruke) and released under MIT licence.  
Any help on the project is more than welcomed.  
For any problem/question do not hesitate to open an issue.  

## Other

For any other information, please visit the [website](http://barbajs.org)
