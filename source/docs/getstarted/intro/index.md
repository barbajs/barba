---
title: Get started
namespace: docs
layout: pages/docs
url: '/docs/getstarted/intro'
---

# barba.js <small>[v2]</small>

![stability-beta](https://img.shields.io/badge/stability-beta-lightgrey.svg?style=flat-square)
[![CircleCI](https://img.shields.io/circleci/project/github/barbajs/barba/master.svg?style=flat-square)](https://circleci.com/gh/barbajs/barba/tree/master)
[![Coverage Status](https://img.shields.io/coveralls/github/barbajs/barba/master.svg?style=flat-square)](https://coveralls.io/github/barbajs/barba?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/barbajs/barba/blob/master/LICENSE)
[![Slack channel](https://img.shields.io/badge/slack-channel-purple.svg?style=flat-square&logo=slack)](https://barbajs.slack.com)

**Barba.js** is a small (7kb minified and compressed) and easy-to-use library that helps you creating fluid and smooth transitions between your website's pages.

It helps reducing the delay between your pages, minimizing browser HTTP requests and enhancing your user's web experience.

> Notice: this guide assumes intermediate level knowledge of HTML, CSS, and JavaScript. It is worth mentioning that all the code examples use ES6+ syntax. If you are not comfortable with, we encourage you to grasp the basics then come back.
>
> In case of emergency, check this ["legacy" code example](legacy.md).

## Useful links

- [User guide](https://barba.js.org/docs/v2/user/)
  - [@barba/core](https://barba.js.org/docs/v2/user/core.html)
  - [@barba/router](https://barba.js.org/docs/v2/user/router.html)
  - [@barba/prefetch](https://barba.js.org/docs/v2/user/prefetch.html)
  - [@barba/css](https://barba.js.org/docs/v2/user/css.html)
  - @barba/head _(coming soon)_
  - @barba/preset _(coming soon)_
- [API documentation](https://barba.js.org/docs/v2/api/)
- [Github repo](https://github.com/barbajs/barba)
- [Slack channel](https://barbajs.slack.com)

## Install

Using npm:

```sh
npm install @barba/core
```

or using yarn:

```sh
yarn add @barba/core
```

or using a CDN:

```html
<script src="https://unpkg.com/@barba/core"></script>
```

## Getting started

> See [@barba/core](https://barba.js.org/docs/v2/user/core.html) for more details…

```js
// do not import Barba like this if you load the library through the browser
import barba from '@barba/core';

// basic default transition (with no rules and minimal hooks)
barba.init({
  transitions: [{
    leave({ current, next, trigger }) {
      // do something with `current.container` for your leave transition
      // then return a promise or use `this.async()`
    },
    enter({ current, next, trigger }) {
      // do something with `next.container` for your enter transition
      // then return a promise or use `this.async()`
    }
  }]
});

// dummy example to illustrate rules and hooks
barba.init({
  transitions: [{
    name: 'dummy-transition',

    // apply only when leaving `[data-barba-namespace="home"]`
    from: 'home',

    // apply only when transitioning to `[data-barba-namespace="products | contact"]`
    to: {
      namespace: [
        'products',
        'contact'
      ]
    },

    // apply only if clicked link contains `.cta`
    custom: ({ current, next, trigger })
      => trigger.classList && trigger.classList.contains('cta'),

    // do leave and enter concurrently
    sync: true,

    // available hooks…
    beforeAppear() {},
    appear() {},
    afterAppear() {},
    beforeLeave() {},
    leave() {},
    afterLeave() {},
    beforeEnter() {},
    enter() {},
    afterEnter() {}
  }]
});
```

## Browser support

Barba.js can be viewed as a [progressive enhancement](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/).  
Main "modern features" used are:

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

> `@barba/prefetch` also uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

Cross-browser support is as follows:

- without polyfills: modern browsers (Chrome, Firefox, Edge, Safari, Opera)
- with polyfills for abovementioned: + IE10

You can use [polyfill.io](https://polyfill.io/v3/):

```html
<script
  crossorigin="anonymous"
  src="https://polyfill.io/v3/polyfill.min.js?features=default%2CArray.prototype.find%2CIntersectionObserver"
></script>
```

or implement your own solution ([es6-promise](https://github.com/stefanpenner/es6-promise) and [Core.js](https://github.com/zloirock/core-js) or [es6-shim](https://github.com/paulmillr/es6-shim/blob/master/README.md), …).
