---
layout: default
title: '@barba/core'
---

# @barba/core

Barba core manages your **page transitions** with ease.

## Markup

At the beginning, Barba needs to know a little bit about your **DOM structure**.
By default, it uses this markup structure in your pages:

```html
<body data-barba="wrapper">
  <main data-barba="container" data-barba-namespace="home">
    <!-- put here the content you wish to change between your pages -->
  </main>
</body>
```

### Wrapper

The wrapper is **the main Barba section** that contains all your page structure and the Barba [container](#container). Be aware, everything inside of this wrapper and outside of the container will not be updated by Barba: you can put your `<header>` and `<nav>` safely here. It is mainly defined on the `<body>` tag, but you can add it on a `div` or `section` for example.

### Container

The container defines **a section in which content is updated automatically** when you navigate between your pages. Be aware, everything inside of this container will be updated by Barba. It is mainly defined on the `<main>` tag, but you can add it on a `div` or `section` for example.

### Namespace

The namespace allow you to define **a unique name for each pages**. Barba mainly uses this namespace for transition [rules](#rules) and [views](#view-object).

> Note that all **data-barba** attributes can be easily customized using the Barba [schema](#schema).

## Syntax

### `barba.init(<options>)`

| Option                              | Type                          | Default                                                              | Description                                   |
| ----------------------------------- | ----------------------------- | -------------------------------------------------------------------- | --------------------------------------------- |
| `transitions`                       | Array                         | []                                                                   | Array of [`<Transition>`](#transition-object) |
| `views`                             | Array                         | []                                                                   | Array of [`<View>`](#view-object)             |
| [`debug`](#debug)                   | Boolean                       | false                                                                | Set logLevel to 'debug'                       |
| [`logLevel`](#loglevel)             | string                        | 'off'                                                                | Log level                                     |
| [`schema`](#schema)                 | Object                        | [`schemaAttribute`](../../../packages/core/src/schemas/attribute.ts) | Data attributes                               |
| [`cacheIgnore`](#cacheignore)       | Boolean \| string \| string[] | false                                                                | Cache strategy                                |
| [`prefetchIgnore`](#prefetchignore) | Boolean \| string \| string[] | true                                                                 | Prefetch strategy                             |
| [`prevent`](#prevent)               | Function                      | (optional)                                                           | Custom prevent test                           |
| [`requestError`](#requesterror)     | Function                      | (optional)                                                           | Custom request error callback                 |

#### `<transition>` object

##### name

An optional name for your transition.

Example:

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    name: 'svg-circle',
    ...
  }, {
    name: 'svg-slide',
    ...
  }]
});
```

##### Hooks

All hooks are **methods** and receive the same [`data`](#data-argument) object.

| Order | Name           | Description                        |
| ----- | -------------- | ---------------------------------- |
| 1     | `beforeAppear` | Before __appear__ transition       |
| 2     | `appear`       | Current page __appear__ transition |
| 3     | `afterAppear`  | Before __appear__ transition       |

| Order | Name          | Description                                               |
| ----- | ------------- | --------------------------------------------------------- |
| 1     | `before`      | Before everything                                         |
| 2     | `beforeLeave` | Before __leave__ transition                               |
| 3     | `leave`       | Current page __leave__ transition                         |
| 4     | `afterLeave`  | After removing __current container__                      |
| 5     | `beforeEnter` | Before __enter__ transition and adding __next container__ |
| 6     | `enter`       | Next page __enter__ transition                            |
| 7     | `afterEnter`  | After removing __next container__                         |
| 8     | `after`       | After everything                                          |

> "Hooks can be run either synchronously or asynchronously using the common `this.async()` style ([see run-async](https://github.com/sboudrias/run-async#readme)) or returning a promise.
>
> If you use [`sync: true`](#sync-mode), as __leave__ and __enter__ will be concurrent, order will differ: all before\*, then enter/leave, then all after\*.
>
> Note that you can define **global hooks** using `barba.hooks` and apply it to all your transitions.

Example:

```js
import barba from '@barba/core';

// defines a global hook
barba.hooks.leave((data) => {
  // this hook will be called for each transitions
});

barba.init({
  transitions: [{

    // basic style
    leave: (data) => {
      // create your stunning leave animation here
    },

    // async/await style
    async leave: (data) => {
      await asyncAnimation(data.current.container);
    },

    // `this.async()` style
    leave: (data) => {
      const done = this.async();

      callbackAnimation(data.current.container, {
        onComplete: () => {
          done();
        },
      });
    },

    // using a promise
    leave: (data) => asyncAnimation(data.current.container),

    // es6 syntax: `{ current } = data.current`
    leave: ({ current }) => asyncAnimation(current.container);,

    // using a promise
    leave: (data) => {
      return new Promise(resolve => {
        callbackAnimation(data.current.container, {
          onComplete: () => {
            resolve();
          },
        });
      });
    },

  }]
});
```

##### `data` argument

Data argument is an object passed to all [transition hooks](#hooks), [view hooks subset](#view-object) and [custom rules](#rules).

| Property                                  | Type              | Description                        |
| ----------------------------------------- | ----------------- | ---------------------------------- |
| [`data.current`](#currentnext-properties) | Object            | Current page related               |
| [`data.next`](#currentnext-properties)    | Object            | Next page related                  |
| `data.trigger`                            | HTMLElement       | Link that triggered the transition |
|                                           | string 'popstate' | Browser back/forward               |
|                                           | string 'barba'    | Programmatic navigation            |

###### `current/next` properties

Properties attached to `data.current` and `data.next` objects.

| Name                         | Type        | Description       |
| ---------------------------- | ----------- | ----------------- |
| [`container`](#container)    | HTMLElement | Barba container   |
| [`namespace`](#namespace)    | string      | Barba namespace   |
| [`url`](#url-properties)     | Object      | URL data the page |
| `html`                       | string      | HTML of the page  |
| [`route`](#route-properties) | Object      | Route object      |

> Depending on [rules](#rules), [sync mode](#sync-mode) or [cache availability](#cacheignore), some properties can be `undefined`.

###### `url` properties

Properties attached to `data.current.url` and `data.next.url` objects.

| Property | Type   | Default         | Description                               |
| -------- | ------ | --------------- | ----------------------------------------- |
| `hash`   | string |                 | URL hash                                  |
| `href`   | string | `location.href` | Complete URL                              |
| `path`   | string |                 | URL path (without origin, hash and query) |
| `query`  | Object | {}              | URL query (key: value)                    |

###### `route` properties

Properties attached to `data.current.route` and `data.next.route` objects.

> `route` is available with `@barba/router`

| Property | Type   | Default | Description          |
| -------- | ------ | ------- | -------------------- |
| `name`   | String | -       | Route name           |
| `params` | Object | {}      | Route segment params |

Example:

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    name: 'svg-circle',
    leave: (data) => {

      // retrieves the current page url
      let from = data.current.url;
    },
    enter: ({ next }) => {

      // retrieves the next page url (short syntax)
      let to = next.url;
    }
  }]
});
```

##### Rules

Rules define the _transition resolution_, concretely "selecting the right transition to use".
You can combine **multiple rules** on each transition.

| Priority | Name        | Type             | Argument                      | Apply when…                |
| -------- | ----------- | ---------------- | ----------------------------- | -------------------------- |
| 1        | `custom`    | Function         | [data](#data-argument) object | Return `true`              |
| 2        | `route`     | String\|String[] | -                             | `current.route.name` match |
| 3        | `namespace` | String\|String[] | -                             | `current.namespace` match  |

> Any rules can be used within `from` and/or `to` properties.

| Priority | Usage           | Apply when…                                 |
| -------- | --------------- | ------------------------------------------- |
| x.1      | `from` AND `to` | Rule(s) match for `current` AND `next` data |
| x.2      | `to`            | Rule(s) match for `next` data               |
| x.3      | `from`          | Rule(s) match for `current` data            |

> Notice that you can use `from` and `to` properties independently.

Example:

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    name: 'custom-transition',
    from: {

      // defines a custom rule based on the trigger class
      custom: ({ trigger }) => {
        return trigger.classList && trigger.classList.contains('use-custom-transition');
      },

      // defines rule based on multiple route names
      route: [
        'index',
        'product'
      ]
    },
    to: {

      // defines rule based on multiple namespaces
      namespace: [
        'home',
        'item'
      ]
    }
  }, {
    name: 'other-transition',
    ...
  }]
});
```

In this example, based on the [priority order](#priority), Barba will use the `custom-transition`:

- if the link you clicked contains a `.use-custom-transition` CSS class
- if you come **from** the `index` or `product` route
- if you are navigating **to** the `home` or `item` namespace AND **from** the `index` or `product` route

##### Priority

The _transition resolution_ follows this order:

1. Rule(s) priority
2. `from` and/or `to` priority
3. Declaration order

> The common/default behaviour is to start __leave__ as soon as possible.
> __enter__ will be called when __leave__ ends _AND_ next page is "available" (fetched or cached).
> If you use some `to` logic, Barba can not predict and select the right transition until the next page is available.
> This also applies when using `sync: true`.
> But this does not apply if `to` is used with `route` property because "next route" is known when the click occurs…
>
> Bear with this!

##### Sync mode

A mode that indicate whether **leave** and **enter** hooks should "play together".
This involves waiting until the next page is available (fetched or cached).

By default the sync mode is set to `false`.

Example:

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    sync: true,
    leave() {
      // transition that will play concurrently to `enter`
    },
    enter() {
      // transition that will play concurrently to `leave`
    }
  }]
});
```

#### `<view>` object

Views allow you to have some **logic related to the content of a namespace**.
You can see it as "lifecycle" into Barba. It is a good place to init or destroy things…
They use a subset of transition hooks and receive the same [`data`](#data-argument) object.

Available hooks are:

- `beforeAppear`
- `afterAppear`
- `beforeLeave`
- `afterLeave`
- `beforeEnter`
- `afterEnter`

Example:

```js
import barba from '@barba/core';

barba.init({
  views: [{
    namespace: 'index',
    beforeLeave(data) {
      // do something before leaving the current `index` namespace
    }
  }, {
    namespace: 'contact',
    beforeEnter(data) {
      // do something before entering the `contact` namespace
    }
  }]
});
```

#### debug

Useful `console.info` about transition used, for **debugging purpose** only.
It sets [logLevel](#loglevel) to `debug`. Default is `off`.

Example:

```js
import barba from '@barba/core';

barba.init({
  debug: true
});
```

#### logLevel

```
0. off
1. error   = console.error()
2. warning = console.warn()
3. info    = console.info()
4. debug   = console.log()
```

#### schema

Allows you to override data attributes. See default [`schemaAttribute`](../../../packages/core/src/schemas/attribute.ts).

Example:

```js
import barba from '@barba/core';

barba.init({

  // overrides defaults and create a custom prefix for wrapper, containers, etc.
  schema: {
    prefix: 'data-custom'
  }
});
```

#### cacheIgnore

Allows Barba to cache your pages.

Saving pages in the cache result in **less bandwidth usage** and **less server-side load**: no `XMLHttpRequest` are made for pages that have already been visited.

If disabled, Barba will retrieve each page **from the server** on every request: this could be useful if your page contains scripts that need to be evaluated on each page call.

You can also define "route" pattern(s) ([see @barba/router](router.md)).

| Value               | Description             |
| ------------------- | ----------------------- |
| `false` (default)   | Cache all               |
| `true`              | Ignore all              |
| `string | string[]` | Ignore route pattern(s) |

> Cache **lifetime** is restricted to Barba instance and will be cleared when leaving the site.

Example:

```js
import barba from '@barba/core';

barba.init({
  cacheIgnore: ['/contact/', '/:category/post?']
});
```

#### prefetchIgnore

Allows Barba to prefetch your pages on `mouseover` or `touchstart` events.

Since there is a 100-300ms delay during the user hover and the click, Barba is using this time to start prefetching the next page. Most of the time this dead time is enough to get the next page ready!

If follows the same logic as the above `cacheIgnore` option…

> To prefetch all eligible links that enter the viewport, use the [@barba/prefetch](prefetch.md) module.

Example:

```js
import barba from '@barba/core';

barba.init({
  prefetchIgnore: false
});
```

#### prevent

Allows you to add a custom "prevent" test.
If your function returns `true`, Barba will not be enabled.

| Argument | Property | Description     |
| -------- | -------- | --------------- |
| Object   | `el`     | Clicked element |
|          | `event`  | Triggered event |
|          | `href`   | Next page href  |

Example:

```js
import barba from '@barba/core';

barba.init({

  // defines a custom function that will prevent Barba
  // from working on link that contains a `prevent` CSS class
  prevent: ({ el }) => el.classList && el.classList.contains('prevent')
});
```

> Note that you can prevent a link of using Barba with the `data-barba-prevent` attribute:
>
> 1. `data-barba-prevent` or `data-barba-prevent="self"` prevents the current link
> 2. `data-barba-prevent="all"` prevents all children links of a container (`div`, `p`, etc.)

#### requestError

Allows you to catch request errors.
If this function returns `false`, wrong links will not be "force" triggered.

| Argument   | Type                | Description                                                                                                                  |
| ---------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `trigger`  | HTMLElement\|string | The clicked/hovered HTMLElement, string 'popstate' or string 'barba' (see [`data.trigger`](#data-argument))                  |
| `action`   | string              | The user action on the link: 'enter' when hovering, 'click' when clicking, or 'prefetch' with [@barba/prefetch](prefetch.md) |
| `url`      | string              | Requested URL                                                                                                                |
| `response` | Object              | Fetch error with `message` or response with `status`, `statusText`, …                                                        |

Example:

```js
import barba from '@barba/core';

barba.init({
  requestError: (trigger, action, url, response) => {

    // go to a custom 404 page if the user click on a link that return a 404 response status
    if (action === 'click' && response.status && response.status === 404) {
      barba.go('/404');
    }

    // prevents Barba from redirecting the user to the requested URL
    // this is equivalent to e.preventDefault()
    return false;
  }
});
```

> Note that if you use `barba.go()` directive without returning `false`, you will be redirected to the requested URL because Barba uses `barba.force()` to reach the page.

## Partial output

Barba sends a custom **HTTP Header** named `x-barba` in the `XMLHttpRequest`.

If you are using a server side language like PHP, you can detect this custom HTTP Header and output just the container instead of the entire page: this could result in **less bandwidth usage** and **less server-side load**.

> Note that doing so, you have to manually handle the upate of the page `title`.
