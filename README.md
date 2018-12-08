# Barba v2

![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg?style=flat-square) [![Coverage Status](https://img.shields.io/coveralls/github/epicagency/barba/master.svg?style=flat-square)](https://travis-ci.com/epicagency/barba) [![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://gitlab.com/luruke/barba-next/blob/master/LICENSE) [![NPM version](https://img.shields.io/npm/v/@barba/core.svg?style=flat-square)](https://www.npmjs.com/package/@barba/core) [![NPM version](https://img.shields.io/npm/v/@barba/router.svg?style=flat-square)](https://www.npmjs.com/package/@barba/router)

> This is pre-release version. Do not use in production!
> CommonJS or UMD builds are not tested. Prefer "module" aka "esm"… (default with Webpack 4).
>
> Thanks in advance for reporting bugs. #sharethelove 😊

## Basic usage

### @barba/core

#### HTML

```html
<div data-barba="wrapper">
  <div data-barba="container" data-barba-namespace="home">
    page content
  </div>
</div>
```

#### JS

```js
import barba from '@barba/core';

barba.init(<options>);
```

#### `barba.init(<options>)`

| Option      | Type    | Default          | Description                                                    |
| ----------- | ------- | ---------------- | -------------------------------------------------------------- |
| transitions | Array   | []               | Array of `<transition>` ([see below](#transitionobject))       |
| debug       | Boolean | false            | Log extra informations                                         |
| schema      | Object  | `attributSchema` | Data attributes ([see schema.js](packages/core/src/schema.js)) |
| useCache    | Boolean | true             | Cache your pages                                               |
| usePrefetch | Boolean | true             | Prefetch your pages                                            |

##### `<transition>` object

> All methods receive `data` object ([see below](#dataargument))

##### 1. Main methods (sync or async)

| Method | Type     | Argument | Description                       |
| ------ | -------- | -------- | --------------------------------- |
| leave  | function | data     | current page __leave__ transition |
| enter  | function | data     | next page __enter__ transition    |

> These methods can be run either synchronously or asynchronously using the common `this.async()` style ([see run-async](https://github.com/sboudrias/run-async#readme))

- returning a promise
    > ```js
    > async leave(data) {
    >   await asyncAnimation(data.current.container);
    > }
    > // or
    > leave(data) {
    >   return asyncAnimation(data.current.container);
    > }
    > // or
    > leave(data) {
    >   return new Promise(resolve => {
    >     callbackAnimation(data.current.container, {
    >       onComplete: () => {
    >         resolve();
    >       },
    >     });
    >   });
    > },
    > ```
- using `this.async()`
    > ```js
    > leave(data) {
    >   const done = this.async();
    >   callbackAnimation(data.current.container, {
    >     onComplete: () => {
    >       done();
    >     },
    >   });
    > }
    > ```
- synchronous
    > ```js
    > leave(data) {
    >   data.current.container.style.opacity = 0;
    > }
    > ```

##### 2. Other methods (only sync)

| Method      | Type     | Argument | Description                                                      |
| ----------- | -------- | -------- | ---------------------------------------------------------------- |
| before      | function | data     | Occurs right before `beforeLeave()`                              |
| beforeLeave | function | data     | Occurs before __leave__ transition                               |
| afterLeave  | function | data     | Occurs after removing __current container__                      |
| beforeEnter | function | data     | Occurs before __enter__ transition and adding __next container__ |
| afterEnter  | function | data     | Occurs after removing __next container__                         |
| after       | function | data     | Occurs right after `afterEnter()`                                |

> If you use `sync: true`, as __leave__ and __enter__ will be concurrent, order will differ (all before*, enter/leave, all after*)

##### `data` argument

- `data.current` (object):
  - `container` [HTMLElement] -> container
  - `namespace` [string] -> namespace (`[data-barba-namespace]`)
  - `url` [string] -> complete URL
  - `html` [string] -> HTML of the page
- `data.next` (object): same as `data.current`.<br>
    > Depending on your transitions properties (see below), can have `undefined` properties.
- `data.trigger` (HTMLElement | string):
  - link that triggered the transition
  - `'popstate'` (browser back/forward)
  - `'barba'` (programmatic navigation)

##### 3. Rules

| Name      | Type            | Argument | Description                                                                  |
| --------- | --------------- | -------- | ---------------------------------------------------------------------------- |
| namespace | String or Array | -        | Transition applies for matching namespace(s)                                 |
| custom    | function        | data     | Transition applies when custom function returns `true`                       |
| route     | String or Array | -        | Transition applies for matching route(s) ([see @barba/router](#barbarouter)) |
| from      | Object          | -        | Allows using rules for `data.current` (with namespace, route, custom)        |
| to        | Object          | -        | Allows using rules for `data.next` (with namespace, route, custom)           |

**Important!!!**

The "transition resolution" (selecting the right transition) follows some rules.

- By priorities:
  1. `custom()`
  2. `route` ([see @barba/router](#barbarouter))
  3. `namespace`
  4. none
- By properties (same priority)
  1. `from` AND `to`
  2. `from` OR `to`
  3. none
- By order (same priority, same property)
  1. first declared

> The common/default behaviour is to start __leave__ as soon as possible.
> __enter__ will be called when __leave__ ends _AND_ next page is "available" (fetched or get from the cache).
> If you use some `to` logic, Barba can not predict and select the right transition until the next page is available.
> This also applies when using `sync: true`.
> But this does not apply if `to` is used with `route` property because "next route" is known when the click occurs…
>
> Bear with this!

##### 4. Other

| Name | Type    | Default | Description                        |
| ---- | ------- | ------- | ---------------------------------- |
| sync | Boolean | false   | __Sync__ mode ([see below](#sync)) |

###### sync

When set to `true`, __leave__ and __enter__ will "play together".
This implies waiting for the full load of the next page.

---

### @barba/router

Barba router allows you to use __routes__ for custom page transitions.
It adds a __route__ rule to Barba (less important than `custom()` but more than `namespace`).

```js
import barba from '@barba/core';
import router from '@barba/router';

const routes = [{ path: '/foo', name: 'foo' }, { path: '/bar', name: 'bar' }];

barba.use(router, { routes });
barba.init(<options>);
```

#### `barba.use(router, <options>)`

| Option | Type  | Default | Description                                    |
| ------ | ----- | ------- | ---------------------------------------------- |
| routes | Array | []      | Array of `<route>` ([see below](#routeobject)) |

##### `<route>` object

| Property | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| name     | String | value to be used with `transition[.from|.to].route` property |
| path     | String | URL pattern                                                  |

###### Note

> `path` accepts dynamic segments (`/product/:id`) and regular expressions (`/:lang(fr|en)/:post`) ([see path-to-regexp](https://github.com/pillarjs/path-to-regexp))

---

## Some transition examples

### `leave` / `enter` (async)

```js
const t = {
  async leave(data) {
    await asyncAnimation(data.current.container);
  },
};
```

```js
const t = {
  leave(data) {
    return asyncAnimation(data.current.container);
  },
};
```

```js
const t = {
  leave(data) {
    return new Promise(resolve => {
      callbackAnimation(data.current.container, {
        onComplete: () => {
          resolve();
        },
      });
    });
  },
};
```

```js
const t = {
  leave(data) {
    const done = this.async();
    callbackAnimation(data.current.container, {
      onComplete: () => {
        done();
      },
    });
  },
};
```

### `data` argument (`data.current`, `data.next`, `data.trigger`)

```js
const t = {
  // ES6 syntax: `{ current } = data.current`
  leave({ current }) {
    // Also available: current.[namespace, url, route, html…]
    return asyncAnimation(current.container);
  },
  enter({ next }) {
    // Also available: next.[namespace, url, route, html…]
    return asyncAnimation(next.container);
  },
};
```

### `namespace` (idem for `route`)

```js
// If `current.namespace` is "home".
const t = {
  namespace: 'home',
};
```

```js
// If `current.namespace` is "products" or "services".
const t = {
  namespace: ['products', 'services'],
};
```

### `custom(data)`

```js
// If `trigger` element has "barba-FTW" CSS class.
const t = {
  custom({ trigger }) {
    return trigger.classList && trigger.classList.contains('barba-FTW');
  },
};
```

### `from` / `to`

```js
// If `current.namespace` is "home" or "about" AND `next.namespace` is "contact"
const t = {
  from: { namespace: ['home', 'about'] },
  to: { namespace: 'contact' },
};
```

```js
// If `trigger` has [data-cta="product"] AND `current.route` is "home" AND `next.route` is "product-single"
const t = {
  custom: ({ trigger }) => trigger.dataset && trigger.dataset.cta === 'product',
  from: { route: 'home' },
  to: { route: 'product-single' },
};
```

---

## Next steps

- [ ] Testing, debugging, fixing, testing…
- [ ] Write complete documentation
- [ ] Generate code documentation
- [ ] New website
