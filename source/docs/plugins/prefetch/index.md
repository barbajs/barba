---
title: Prefetch
namespace: docs
layout: pages/docs
url: '/docs/plugins/prefetch'
---

# @barba/prefetch

Barba prefetch **automatically fetch and cache** your pages.

It is mainly inspired by [quicklink](https://github.com/GoogleChromeLabs/quicklink).

## Definition

Based on _Intersection Observer_, it processes **all eligible links** that enter the viewport. Note that depending on your browser, you may need a polyfill to properly use this module.

## Usage

You can use this feature regardless the [`prefetchIgnore`](core.md#prefetchignore) core property: since the links will be prefetched depending on the viewport, it will prevent the core prefetch process from prefetching a link on enter.

Example:

```js
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';

// tell Barba to use the prefetch module
barba.use(barbaPrefetch);

// init Barba
barba.init();
```

> On slow network or with a high page weight, the server can take time to prefetch the response and can lead Barba to abort the transition and display a *Timeout error [2000]* message.
>
> See the [`timeout`](core.md#timeout) setting to properly manage this behavior.
