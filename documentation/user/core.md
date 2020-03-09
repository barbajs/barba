---
layout: default
title: '@barba/core'
---

# @barba/core

[![NPM version](https://img.shields.io/npm/v/@barba/core?style=flat-square)](https://www.npmjs.com/package/@barba/core)
[![Dependencies](https://img.shields.io/librariesio/release/npm/@barba/core?style=flat-square)](https://github.com/barbajs/barba/network/dependencies)

Barba core manages your **page transitions** with ease.

## Markup

At the beginning, Barba needs to know a little bit about your **DOM structure**.
By default, it uses this markup structure in your pages:

```html
<body data-barba="wrapper">
  <!-- put here content that will not change
  between your pages, like <header> or <nav> -->

  <main data-barba="container" data-barba-namespace="home">
    <!-- put here the content you wish to change
    between your pages, like your main content <h1> or <p> -->
  </main>

  <!-- put here content that will not change
  between your pages, like <footer> -->
</body>
```

> Note that you can build the `html` in many ways, but keep in mind that the `wrapper` should always wrap the `container`

### Wrapper

The wrapper is **the main Barba section** that contains all your page structure and the Barba [container](#container). Be aware, everything inside of this wrapper and outside of the container **will not be updated by Barba**: you can put your `<header>`, `<footer>` or `<nav>` safely here. It is mainly defined on the `<body>` tag, but you can add it on a `div` or `section` for example.

### Container

The container defines **a section in which content is updated automatically** when you navigate between your pages. Be aware, everything inside of this container **will be updated by Barba**: you can put your `<footer>` safely here. It is mainly defined on the `<main>` tag, but you can add it on a `div` or `section` for example.

### Namespace

The namespace allow you to define **a unique name for each pages**. Barba mainly uses this namespace for transition [rules](#transition-rules) and [views](#view-objects).

> Note that all **data-barba** attributes can be easily customized using the Barba [schema](#schema-property).

## Syntax

For samples, see the [**Getting Started** docs page](https://barba.js.org/docs/getstarted/intro/)'s "Getting Started" section.

### `barba.init(<options>)`

| Option                                       | Type                                 | Default           | Description                                       |
| -------------------------------------------- | ------------------------------------ | ----------------- | ------------------------------------------------- |
| `transitions`                                | Array                                | []                | Array of [`<Transition>`](#transition-objects)    |
| `views`                                      | Array                                | []                | Array of [`<View>`](#view-objects)                |
| [`debug`](#debug-property)                   | Boolean                              | false             | Set logLevel to 'debug'                           |
| [`logLevel`](#loglevel-property)             | String                               | 'off'             | Log level                                         |
| [`schema`](#schema-property)                 | Object                               | `schemaAttribute` | Data attributes used when parsing the DOM         |
| [`cacheIgnore`](#cacheignore-property)       | Boolean, string, or array of strings | false             | Cache strategy                                    |
| [`prefetchIgnore`](#prefetchignore-property) | Boolean, string, or array of strings | true              | Prefetch strategy                                 |
| [`preventRunning`](#preventrunning-property) | Boolean                              | false             | Prevent "force reload" when transition is running |
| [`prevent`](#prevent-property)               | Function                             |                   | Prevent Barba from running on certain links       |
| [`requestError`](#requesterror-property)     | Function                             |                   | Callback to handle request errors                 |
| [`timeout`](#timeout-property)               | Integer                              | 2000              | Request timeout duration (ms)                     |

`<Transition>`s and `<View>`'s make use of the [`data` object](#data-object).

#### `<Transition>` objects

Define your transitions as `<Transition>` objects in the `barba.init` `transitions` array. `<Transitions>` have the following properties:

| Property                      | Type                             | Description                                                                                               |
| ----------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`name`](#transition-name)    | String                           | Identifier                                                                                                |
| [hooks](#transition-hooks)    | Methods with Barba-defined names | Where you define what happens during a page transition                                                    |
| [rules](#transition-rules)    | Mixed                            | Logic determining whether or not to use a given transition                                                |
| [sync](#transition-sync-mode) | Boolean                          | Whether or not hooks related to the outgoing page run at the same time as those related to incoming page. |

##### Transition `name`

An optional name for your transition.

Example:

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    name: 'svg-circle',
    // ...
  }, {
    name: 'svg-slide',
    // ...
  }]
});
```

##### Transition hooks

All hooks are **methods** and receive the same [`data`](#data-object) object.

| Order | Name         | Description                      |
| ----- | ------------ | -------------------------------- |
| 1     | `beforeOnce` | Before **once** transition       |
| 2     | `once`       | Current page **once** transition |
| 3     | `afterOnce`  | After **once** transition        |

| Order | Name          | Description                                                     |
| ----- | ------------- | --------------------------------------------------------------- |
| 1     | `before`      | Before everything                                               |
| 2     | `beforeLeave` | Before **leave** transition                                     |
| 3     | `leave`       | Current page **leave** transition                               |
| 4     | `afterLeave`  | After **leave** transition                                      |
| 5     | `beforeEnter` | Before **enter** transition and after adding **next container** |
| 6     | `enter`       | Next page **enter** transition                                  |
| 7     | `afterEnter`  | After **enter** transition                                      |
| 8     | `after`       | After everything                                                |

For transitions using [`sync: true`](#transition-sync-mode), the order changes because **leave** and **enter** are concurrent:

| Order | Name                                      |
| ----- | ----------------------------------------- |
| 1     | `before`, `beforeEnter` and `beforeLeave` |
| 2     | `enter` and `leave`                       |
| 3     | `after`, `afterEnter`, and `afterLeave`   |

Hooks can be run either synchronously or asynchronously. Asynchronous hooks can be written with the `async/await` pattern, the `this.async()` pattern (thanks to [run-async](https://github.com/sboudrias/run-async#readme)), or by returning a promise.

See [`data` object](#data-object) for an explanation of the `data` used in the following hook examples.

Example: a synchronous hook

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    leave(data) {
      // `leave` animation here
    }
  }]
});
```

Example: four possible patterns for an asynchronous. Assume `asyncAnimation` and `callbackAnimation` are defined animation functions.

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    // async/await
    async leave(data) {
      await asyncAnimation(data.current.container);
    },

    // `this.async()`
    leave(data) {
      const done = this.async();

      callbackAnimation(data.current.container, {
        onComplete: () => {
          done();
        },
      });
    },

    // a promise returned with arrow function
    leave: (data) => asyncAnimation(data.current.container),

    // an explicit promise
    leave(data) => {
      return new Promise(resolve => {
        callbackAnimation(data.current.container, {
          onComplete: () => {
            resolve();
          },
        });
      });
    }
  }]
});
```

###### Global `hooks`

To share a hook across all `<Transition>`s in the `transitions` array, create a global hook on `barba.hooks`.

Example

```js
import barba from '@barba/core';

barba.hooks.leave((data) => {
  // `leave` hook shared by all `<Transition>`s in `transitions`
});
```

##### Transition rules

Rules determine which transition is applied, the _transition resolution_. You can combine **multiple rules** on each transition.

There are two rule objects, `<Transition>.from` and `<Transition>.to`. `data.current` determines which `from` rule(s) will be used; `data.next` determines with `to` rule(s) will be used.

There are three types of rules, _any or all of which_ may be used by a given transition's `to` or `from`: `custom`, `route`, and `namespace`:

| Priority | Name        | Type             | Argument                      | Apply when…                                                        |
| -------- | ----------- | ---------------- | ----------------------------- | ------------------------------------------------------------------ |
| 1        | `custom`    | Function         | [`data` object](#data-object) | Rule returns `true`                                                |
| 2        | `route`     | String or Array  |                               | Value includes `data.current.route.name`. Requires `@barba/router` |
| 3        | `namespace` | String or Array  |                               | Value includes `data.current.namespace`                            |

###### Transition rules' priority

| Priority | Usage           | Apply when…                                 |
| -------- | --------------- | ------------------------------------------- |
| 1        | `from` AND `to` | Rule(s) match for `current` AND `next` data |
| 2        | `to`            | Rule(s) match for `next` data               |
| 3        | `from`          | Rule(s) match for `current` data            |

> Notice that you can use `from` and `to` properties independently. A given transition could be used when leaving Page 1 and also when going to Page 2, even if there is no link on Page 1 to Page 2.

Example: the transition named "custom-transition" will be used in any of these scenarios, assuming their is not a higher priority match in the transition named "other-transition".

- the clicked link has the CSS class `.use-custom-transition`
- the current page is the "index" or "product" `route`
- the destination is in the "home" or "item" `namespace`

```js
import barba from '@barba/core';

barba.init({
  transitions: [{
    name: 'custom-transition',

    // ...

    // rules
    from: {
      // define a custom rule based on `data.trigger`'s CSS
      custom: ({ trigger }) => {
        return trigger.classList && trigger.classList.contains('use-custom-transition');
      },

      // define rule based on multiple route names
      route: [
        'index',
        'product'
      ]
    },
    to: {
      // Define rule based on multiple namespaces
      namespace: [
        'home',
        'item'
      ]
    }
  }, {
    name: 'other-transition',
    // ...
  }]
});
```

##### Transition sync mode

If sync mode is set to true, the transition's **leave** and **enter** [hooks](#transition-hooks) will run at the same time.

> Note that this means the **leave** hook will not start until the next page is available (fetched or cached).

By default sync mode is `false`.

Example:

```js
import barba from '@barba/core';

barba.init({
  transitions: [
    {
      sync: true,
      leave() {
        // transition that will play concurrently to `enter`
      },
      enter() {
        // transition that will play concurrently to `leave`
      },

      // rules...
    },
  ],
});
```

##### Transition resolution priority

It is possible for multiple transitions to match the current page change context. _Transition resolution_ —which transition to use— is determined by this priority order:

1. [Rule(s) priority](#transition-rules-priority)
2. `from` and/or `to` priority
3. Declaration order in the `transitions` array

> The default behaviour is to start **leave** as soon as possible, and to start **enter** when **leave** ends _AND_ the next page is "available" (fetched or cached). If using [sync mode](#transition-sync-mode), or `to.custom` or `to.namespace` [rules](#transition-rules), **leave** will not start until the next page is available, at which time its namespace and DOM content will be known. (`to.route` rules do not introduce this **leave** delay because "next route" is known when the click occurs.)

### `<View>` objects

Define behaviors for all pages in a given namespace as `<View>` objects in the `barba.init` `views` array. You can see `<View>`s as "lifecycle" into Barba. It is a good place to initialize or destroy things.

`<View>s` have the following properties:

| Property                       | Type                             | Description                                                |
| ------------------------------ | -------------------------------- | ---------------------------------------------------------- |
| [`namespace`](#view-namespace) | String                           | Logic determining whether or not to use a given transition |
| [hooks](#view-hooks)           | Methods with Barba-defined names | Where you define what happens during a page transition     |

##### View namespace

The `<View>`'s `namespace` determines which Barba namespace the `<View>`'s hooks will apply to.

##### View hooks

The available hooks are a subset of [transition hooks](#transition-hooks). They receive the [`data` object](#data-object).

Available hooks are:

| Order | Name          | Description                                                     |
| ----- | ------------- | --------------------------------------------------------------- |
| 1     | `beforeLeave` | Before **leave** transition                                     |
| 2     | `afterLeave`  | After **leave** transition                                      |
| 3     | `beforeEnter` | Before **enter** transition and after adding **next container** |
| 4     | `afterEnter`  | After **enter** transition                                      |

Example:

```js
import barba from '@barba/core';

barba.init({
  views: [
    {
      namespace: 'index',
      beforeLeave(data) {
        // do something before leaving the current `index` namespace
      },
    },
    {
      namespace: 'contact',
      beforeEnter(data) {
        // do something before entering the `contact` namespace
      },
    },
  ],
});
```

##### `data` object

The Barba `data` object is available to all [transition hooks](#transition-hooks), [view hooks](#view-hooks), and [`custom`-type transition rules](#transition-rules). It has the properties `current`, `next`, and `trigger`.

| Property                                     | Type                  | Description                                                                                                                                                                                                   |
| -------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`current`](#datacurrentdatanext-properties) | Object                | Current page                                                                                                                                                                                                  |
| [`next`](#datacurrentdatanext-properties)    | Object                | Next page                                                                                                                                                                                                     |
| `trigger`                                    | HTMLElement or String | If HTMLElement, the link that triggered the transition.<br>If string, either programmatic navigation (value 'barba'), the browser back button (value 'back'), or the browser forward button (value 'forward') |

The last three are useful for example when using the [`requestError` property](#requesterror-property).

###### `data.current`/`data.next` properties

| Name                                                 | Type        | Description                              |
| ---------------------------------------------------- | ----------- | ---------------------------------------- |
| [`container`](#container)                            | HTMLElement | Barba container                          |
| [`namespace`](#namespace)                            | String      | Barba namespace                          |
| [`url`](#datacurrenturldatanexturl-properties)       | Object      | URL data the page                        |
| `html`                                               | String      | HTML of the page                         |
| [`route`](#datacurrentroutedatanextroute-properties) | Object      | Route object. _Requires `@barba/router`_ |

> Depending on the transition's [rules](#transition-rules) and [sync mode](#transition-sync-mode), and the pages' [cache availability](#cacheignore-property), some properties can be `undefined`.

###### `data.current.url`/`data.next.url` properties

| Property | Type   | Default         | Description                               |
| -------- | ------ | --------------- | ----------------------------------------- |
| `hash`   | String |                 | URL hash                                  |
| `href`   | String | `location.href` | Complete URL                              |
| `path`   | String |                 | URL path (without origin, hash and query) |
| `query`  | Object | {}              | URL query (key: value)                    |

###### `data.current.route`/`data.next.route` properties

Requires `@barba/router`.

| Property | Type   | Default | Description          |
| -------- | ------ | ------- | -------------------- |
| `name`   | String |         | Route name           |
| `params` | Object | {}      | Route segment params |

Example:

```js
import barba from '@barba/core';
import barbaRouter from '@barba/router';

barba.init({
  transitions: [
    {
      name: 'svg-circle',
      leave(data) {
        // retrieve the current page url
        const from = data.current.url;
      },
      enter({ next }) {
        // retrieve the next page, using destructings syntax
        const to = next.url;
      },
    },
  ],
});
```

### `debug` property

Useful `console.info` about transition used, for **debugging purpose** only.
It sets [logLevel](#loglevel-property) to `debug`. Default is `off`.

Example:

```js
import barba from '@barba/core';

barba.init({
  debug: true,
});
```

### `logLevel` property

```
- 0 = off
- 1 = error   = console.error()
- 2 = warning = console.warn()
- 3 = info    = console.info()
- 4 = debug   = console.log()
```

### `schema` property

Allows you to customize the data attributes Barba looks for in your markup. See the default [`schemaAttribute`](https://github.com/barbajs/barba/blob/master/packages/core/src/schemas/attribute.ts).

Example:

```js
import barba from '@barba/core';

barba.init({
  // override defaults and create a custom prefix for wrapper, containers, etc.
  schema: {
    prefix: 'data-custom',
  },
});
```

#### `cacheIgnore` property

Allows Barba to cache your pages.

Saving pages in the cache result in **less bandwidth usage** and **less server-side load**: no `XMLHttpRequest` are made for pages that have already been visited.

If disabled, Barba will retrieve each page **from the server** on every request: this could be useful if your page contains scripts that need to be evaluated on each page call.

You can also define "route" pattern(s) ([see @barba/router](router.md)).

| Value                      | Description             |
| -------------------------- | ----------------------- |
| `false` (default)          | Cache all               |
| `true`                     | Ignore all              |
| String or Array of strings | Ignore route pattern(s) |

> Cache **lifetime** is restricted to Barba instance and will be cleared when leaving the site.

Example:

```js
import barba from '@barba/core';

barba.init({
  cacheIgnore: ['/contact/', '/:category/post?'],
});
```

#### `prefetchIgnore` property

Allows Barba to prefetch your pages on `mouseover` or `touchstart` events. Default is `true`.

Since there is a 100-300ms delay during the user hover and the click, Barba is using this time to start prefetching the next page. Most of the time this dead time is enough to get the next page ready!

If follows the same logic as the above `cacheIgnore` option.

> To prefetch all eligible links that enter the viewport, use the [@barba/prefetch](prefetch.md) module.

Example:

```js
import barba from '@barba/core';

barba.init({
  prefetchIgnore: false,
});
```

#### `preventRunning` property

Tells Barba to not "force reload" the page when a transition is running and the user clicks on an eligible link. Default is `false`.

Example:

```js
import barba from '@barba/core';

barba.init({
  preventRunning: true,
});
```

#### `prevent` property

Allows you to add a custom "prevent" test to prevent Barba from running on specific links.
If your function returns `true`, Barba will not run.

| Argument | Property | Description     |
| -------- | -------- | --------------- |
| Object   | `el`     | Clicked element |
|          | `event`  | Triggered event |
|          | `href`   | Next page href  |

Example:

```js
import barba from '@barba/core';

barba.init({
  // prevent Barba from working on links with the CSS class `prevent`
  prevent: ({ el }) => el.classList && el.classList.contains('prevent'),
});
```

> Note that you can also prevent a link from using Barba with the `data-barba-prevent` attribute:
>
> 1. `data-barba-prevent` or `data-barba-prevent="self"` on a link prevents Barba from working on it
> 2. `data-barba-prevent="all"` on a parent prevents Barba from working on all child links

#### `requestError` property

Allows you to catch request errors.
If this function returns `false`, broken links will not be followed.

| Argument   | Type                  | Description                                                                                                                  |
| ---------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `trigger`  | HTMLElement or String | The clicked/hovered HTMLElement, or string 'back', 'forward', or 'barba' (see [`data.trigger`](#data-object))                |
| `action`   | String                | The user action on the link: 'enter' when hovering, 'click' when clicking, or 'prefetch' with [@barba/prefetch](prefetch.md) |
| `url`      | String                | Requested URL                                                                                                                |
| `response` | Object                | Fetch error with `message` or response with `status`, `statusText`, …                                                        |

Example:

```js
import barba from '@barba/core';

barba.init({
  requestError: (trigger, action, url, response) => {
    // go to a custom 404 page if the user click on a link that return a 404 response status
    if (action === 'click' && response.status && response.status === 404) {
      barba.go('/404');
    }

    // prevent Barba from redirecting the user to the requested URL
    // this is equivalent to e.preventDefault()
    return false;
  },
});
```

> Note that if you use `barba.go()` directive without returning `false`, you will be redirected to the requested URL because Barba uses `barba.force()` to reach the page.

#### `timeout` property

On slow connection or with a high page weight, the server can take time to give a response to the user. In case the page take **more than timeout** to be loaded, it lead Barba to abort the transition and display a _Timeout error [2000]_ message.

To prevent this behavior, you can increase the `timeout`:

```js
import barba from '@barba/core';

barba.init({
  timeout: 5000,
});
```

In addition, you can properly catch the error by using the [`requestError`](#requesterror-property) callback.

## Partial output

Barba sends a custom **HTTP Header** named `x-barba` in the `XMLHttpRequest`.

If you are using a server side language like PHP, you can detect this custom HTTP Header and output just the container instead of the entire page: this could result in **less bandwidth usage** and **less server-side load**.

> Note that doing so, you have to manually handle the update of the page `title`.

Example:

```php
<?php
  // check for the server side x-barba request header
  if (isset($_SERVER['HTTP_X_BARBA'])) {

    // this content will only be displayed if the page is called with BarbaJS
    echo "I ❤ Barba";
  }
?>
```

## Utils <small>_draft section_</small>

- barba.destroy()
- barba.force(href: string)
- barba.go(href: string, trigger?: Trigger, e?: LinkEvent \| PopStateEvent)
- barba.prefetch(href: string)
- barba.request(url: string, ttl?: number, requestError: RequestError)
- barba.version
- barba.url.\*

> This is a draft section of **@barba/core** utilities, check the [API documentation](https://barba.js.org/docs/v2/api) for more informations.
