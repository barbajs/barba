# [barba.js](http://barbajs.org)

*barba.js* it's a small *(4.4kb minified and gzipped)*, flexible and dependency free library that helps you creating fluid and smooth transitions between your website's pages.

It helps reducing the delay between your pages, minimizing browser HTTP requests and enhancing your user's web experience.

### Grid Demo [(view)](http://barbajs.org/demo/grid/index.html)
[<img src="http://a66.imgup.net/barba_gride5e8.gif" width="300">](http://barbajs.org/demo/grid/index.html)


### Next/Prev demo [(view)](http://barbajs.org/demo/nextprev/index.html)
[<img src="http://g56.imgup.net/ezgif-3823162d.gif" width="300">](http://barbajs.org/demo/nextprev/index.html)


### Circles demo [(view)](http://barbajs.org/demo/nextprev-circle/index.html)
[<img src="http://y88.imgup.net/barba_clip862d.gif" width="300">](http://barbajs.org/demo/nextprev-circle/index.html)

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
```
<script src="barba.min.js" type="text/javascript"></script>
```
barba.js needs to know a little bit about your DOM structure. By default uses this markup structure in your pages:

```
<div id="barba-wrapper">
  <div class="barba-container">
    ...Put here the content you wish to change between pages...
  </div>
</div>
```

> Please note, all the selector (#barba-wrapper, .barba-container) are easily editable, see the API section.

After you've included barba.js in your project it's time to initialize it

```
// Please note, the DOM should be ready
Barba.Pjax.start();
```

## Contribute

Barba.js is created in the spare time by [Luigi De Rosa](https://twitter.com/luruke) and released under MIT licence.  
Any help on the project is more than welcomed.  
For any problem/question do not hesitate to open an issue.  

## Other

For any other information, please visit the [website](http://barbajs.org)
