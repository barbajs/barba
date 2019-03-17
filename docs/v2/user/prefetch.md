---
layout: default
title: '@barba/prefetch'
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
import prefetch from '@barba/prefetch';

// tells barba to use the prefetch module
barba.use(prefetch);

barba.init();
```
