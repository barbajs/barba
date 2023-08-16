---
title: Prefetch
namespace: docs
layout: components/docs/docs
url: 'docs/plugins/prefetch/'
---

# @barba/prefetch

[![NPM version](https://img.shields.io/npm/v/@barba/prefetch?style=flat-square)](https://www.npmjs.com/package/@barba/prefetch "Badge")
[![Dependencies](https://img.shields.io/librariesio/release/npm/@barba/prefetch?style=flat-square)](https://github.com/barbajs/barba/network/dependencies "Badge")

Barba **prefetches automatically and cache** your pages.

It is mainly inspired by [quicklink](https://github.com/GoogleChromeLabs/quicklink).

## How it works?

Based on _Intersection Observer_, it processes **all eligible links** that enter the viewport. Depending on your browser, you may need a [polyfill](/docs/getstarted/browser-support/#Polyfill) to properly use this plugin.

You can use this feature regardless of the [`prefetchIgnore`](/docs/advanced/strategies/#prefetchIgnore) core property. Since the links will be prefetched depending on the viewport, it will **prevent the core prefetch process** from prefetching a link on enter.

```js
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';

// tell Barba to use the prefetch plugin
barba.use(barbaPrefetch);

// init Barba
barba.init();
```

> On slow network or with a high page weight, the server can take time to prefetch the response and can lead Barba to abort the transition and display a *Timeout error* message.
>
> See the [`timeout`](/docs/advanced/recipes/#timeout) setting to properly manage this behavior.

## Options

### `root`

The `HTMLElement` or `HTMLDocument` to wrap, by default it uses the `document.body`.

You can **pass a custom element** to prevent the plugin from prefetching all links from the entire wrapper. You can also apply a custom [limit](/docs/plugins/prefetch/#limit) to only prefetch the 4th first link of the `root` element.

### `timeout`

Delay before internal `requestIdleCallback` call is canceled, in `milliseconds`.

> See https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#parameters.

### `limit`

Number limit of links to be prefetched.

> **Zero mean "no limit"**: the plugin will prefetch all eligible links of the [root](/docs/plugins/prefetch/#root) element.

Here is an example with all options passed to the plugin:

```js
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';

// get the wrapper
const wrapper = document.querySelector('.prefetch-wrapper');

// tell Barba to use the prefetch plugin
barba.use(barbaPrefetch, {
  root: wrapper,
  timeout: 2500,
  limit: 0
});

// init Barba
barba.init();
```
