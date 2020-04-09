---
subtitle: Hooks
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/hooks/'
---

# Hooks

A "hook" is a **regular method** that is called at a specific time in the Barba lifecycle.

Hooks are triggered by [`Transitions`](/docs/advanced/transitions/) and [`Views`](/docs/advanced/views/), but are not "shared" between them: **they run separately**, either **synchronously or asynchronously** using the common `this.async()` syntax _([see run-async](https://github.com/sboudrias/run-async#readme))_ or returning a promise.

## Base hooks

Barba uses a collection of base hooks for `Transitions` and `Views`:

| Order | Name          | Description                                                         | Transitions | Views |
| ----- | ------------- | ------------------------------------------------------------------- | ----------- | ----- |
| 1     | `beforeOnce`  | Before **once** transition _(browser first load)_                   | x           |       |
| 2     | `once`        | Current page **once** transition _(browser first load)_             | x           |       |
| 3     | `afterOnce`   | Before **once** transition _(browser first load)_                   | x           |       |
| 4     | `before`      | Before everything                                                   | x           |       |
| 5     | `beforeLeave` | Before **leave** transition/view                                    | x           | x     |
| 6     | `leave`       | Current page **leave** transition                                   | x           |       |
| 7     | `afterLeave`  | After **leave** transition/view _(next container is **DOM ready**)_ | x           | x     |
| 8     | `beforeEnter` | Before **enter** transition/view                                    | x           | x     |
| 9     | `enter`       | Next page **enter** transition                                      | x           |       |
| 10    | `afterEnter`  | After **enter** transition/view                                     | x           | x     |
| 11    | `after`       | After everything                                                    | x           |       |

> Each hook run in **a precise order**. If the [sync mode](/docs/advanced/transitions#Sync-mode) is enabled, as **leave** and **enter** will be concurrent, order will differ: first all before\*, then enter/leave, and finally all after\*

You can define them in **many different ways**, depending on your code implementation:

```js
// using a promise (returned with arrow function)
leave: (data) => asyncAnimation(data.current.container)

// using a promise (with ES6 argument syntax)
leave: ({ current }) => asyncAnimation(current.container)

// using a promise (with a resolve call)
leave: (data) => {
  return new Promise(resolve => {
    callbackAnimation(data.current.container, {
      onComplete: () => {
        resolve();
      }
    });
  });
}

// `this.async()`
leave(data) {
  const done = this.async();

  callbackAnimation(data.current.container, {
    onComplete: () => {
      done();
    }
  });
}

// async/await
async leave(data) {
  await asyncAnimation(data.current.container);
}
```

## Global hooks

In order to improve and optimize your code, Barba offer a way to define global hooks through `barba.hooks`. This will **execute code everytime the hook is called** in the lifecycle. What makes the hook global is that the definition is not wrap inside a `Transition` or a `View`.

For example, if you want to scroll the window to the top **everytime you enter a new page**, just do:

```js
barba.hooks.enter(() => {
  window.scrollTo(0, 0);
});
```

> Note that `beforeOnce`, `once` and `afterOnce` global hooks are not permitted

## Parameters

### `data` argument

All hooks receive the same `data` argument object that contains **current and next page properties**.
This allows access to useful informations, like namespace, route or URL:

```js
barba.init({
  transitions: [{
    leave(data) {
      // get the current URL
      let href = data.current.url.href;
    }
  }]
});
```

> You can use **ES6 shorthand argument** syntax `({ current })` to easily access `data.current` inside the hook

#### `data` properties

Properties attached to `data` object:

| Property                                   | Type                           | Description                        |
| ------------------------------------------ | ------------------------------ | ---------------------------------- |
| [`data.current`](#current-next-properties) | Object                         | Current page related               |
| [`data.next`](#current-next-properties)    | Object                         | Next page related                  |
| `data.trigger`                             | HTMLElement                    | Link that triggered the transition |
|                                            | String `'barba'`               | Programmatic navigation            |
|                                            | String `'back'` \| `'forward'` | Browser backward/forward button    |

#### `current/next` properties

Properties attached to `data.current` and `data.next` objects:

| Name                                              | Type        | Description      |
| ------------------------------------------------- | ----------- | ---------------- |
| [`container`](/docs/getstarted/markup/#Container) | HTMLElement | Barba container  |
| [`namespace`](/docs/getstarted/markup/#Namespace) | String      | Barba namespace  |
| [`url`](#url-properties)                          | Object      | URL of the page  |
| [`route`](#route-properties)                      | Object      | Route object     |
| `html`                                            | String      | HTML of the page |

> According to the [lifecycle](/docs/getstarted/lifecycle/), [rules](/docs/advanced/transitions#Rules), [sync mode](/docs/advanced/transitions#Sync-mode) or [cache availability](/docs/advanced/strategies#cacheIgnore), some properties may be `undefined`

#### `url` properties

Properties attached to `data.current.url` and `data.next.url` objects:

| Property | Type   | Default             | Description                               |
| -------- | ------ | ------------------- | ----------------------------------------- |
| `hash`   | String | `undefined`         | URL hash                                  |
| `href`   | String | `location.href`     | URL complete location                     |
| `path`   | String | `location.pathname` | URL path (without origin, hash and query) |
| `query`  | Object | {}                  | URL query (key: value)                    |

#### `route` properties

Properties attached to `data.current.route` and `data.next.route` objects:

| Property | Type   | Default     | Description          |
| -------- | ------ | ----------- | -------------------- |
| `name`   | String | `undefined` | Route name           |
| `params` | Object | {}          | Route segment params |

> `route` is **only** available when using [`@barba/router`](/docs/plugins/router/)
