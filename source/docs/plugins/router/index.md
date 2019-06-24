---
title: Router
namespace: docs
layout: pages/docs
url: '/docs/plugins/router'
---

# @barba/router

Barba router allows you to use **custom routes** for page transitions.

## Definition

This module adds a __route__ rule to Barba, that is less important than `custom()` but more than `namespace`, see core [transition rules](core.md#rules) for details.

## Syntax

### `barba.use(router, <options>)`

| Option   | Type  | Default | Description                         |
| -------- | ----- | ------- | ----------------------------------- |
| `routes` | Array | []      | Array of [`<Route>`](#route-object) |

#### `<route>` object

| Property | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| `name`   | String | Value to be used with transitions |
| `path`   | String | URL pattern                       |

> `path` supports dynamic segments `/product/:id` and regular expressions `/:lang(fr|en)/:post`
> See the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for detailed documentation.

Example:

```js
import barba from '@barba/core';
import barbaRouter from '@barba/router';

// define your routes
const routes = [{
  path: '/index',
  name: 'home'
}, {
  path: '/product/:id',
  name: 'item'
}];

// tell Barba to use the router with your custom routes
barba.use(barbaRouter, {
  routes,
});

// init Barba
barba.init();
```
