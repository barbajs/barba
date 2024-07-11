---
title: Browser support
namespace: docs
layout: components/docs/docs
url: 'docs/getstarted/browser-support/'
---

# Browser support

Barba can be viewed as a [progressive enhancement](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/).

## Compatibility

Main **modern features** used are:

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) *(used by [@barba/prefetch](/docs/plugins/prefetch/))*

Cross-browser support is as follows:

- without polyfills: modern browsers (Chrome, Firefox, Edge, Safari, Opera)
- with polyfills for abovementioned: IE10+

## Polyfill

You can implement your own solution for polyfilling as well, here are some references you could use:
- [core.js](https://github.com/zloirock/core-js)
- [es6-shim](https://github.com/paulmillr/es6-shim/blob/master/README.md)
- [es6-promise](https://github.com/stefanpenner/es6-promise)

> ⚠️ Since **polyfill.io has been compromised**, it's no longer safe and recommended to use this web service.  
> Read https://censys.com/july-2-polyfill-io-supply-chain-attack-digging-into-the-web-of-compromised-domains/.
