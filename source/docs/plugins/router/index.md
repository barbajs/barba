---
title: Router
namespace: docs
layout: components/docs/docs
url: 'docs/plugins/router/'
---

# @barba/router

[![NPM version](https://img.shields.io/npm/v/@barba/router?style=flat-square)](https://www.npmjs.com/package/@barba/router)
[![Dependencies](https://img.shields.io/librariesio/release/npm/@barba/router?style=flat-square)](https://github.com/barbajs/barba/network/dependencies)

Barba router allows you to use **custom routes** for page transitions.

## How it works?

This module adds a __route__ rule to Barba, that is less important than `custom()` but more than `namespace`. Take a look at the [transition rules](/docs/advanced/transitions#Rules) for priority order and details.

Start to define your routes, then tell Barba to use the plugin **before** the `init()` step:

```js
import barba from '@barba/core';
import router from '@barba/router';

// define your routes
const myRoutes = [{
  path: '/index',
  name: 'home'
}, {
  path: '/product/:id',
  name: 'item'
}];

// tell Barba to use the router with your routes
barba.use(router, {
  routes: myRoutes
});

// init Barba
barba.init();
```

## Options

### `routes`

Barba router plugin `routes` property accepts an array of [`Route`](#Route-object) objects.

#### `Route` object

| Property | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| `name`   | String | Value to be used with transitions |
| `path`   | String | URL pattern                       |

> `path` supports dynamic segments `/product/:id` and regular expressions `/:lang(fr|en)/:post`
> See the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for detailed documentation
