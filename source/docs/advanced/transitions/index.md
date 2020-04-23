---
subtitle: Transitions
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/transitions/'
---

# Transitions

Barba allows you to define a **global transition**, that run everywhere on your site, and/or **specific transitions** using [rules](#Rules) that run when navigating from one page to another.

They use all [base `hooks`](/docs/advanced/hooks/#Base-hooks).

## Syntax

```js
barba.init({
  transitions: [{
    name: 'default-transition',
    leave() {
      // create your stunning leave animation here
    },
    enter() {
      // create your amazing enter animation here
    }
  }]
});
```

> transition `name` is optional, but recommended.

## Rules

Rules **define the "transition resolution"**, concretely "selecting the right transition to use".
This allows you to create specific transitions, based on namespace, route or custom logic.

They are made of [keyword(s)](#Keyword-s) and [condition(s)](#Condition-s).

### Keyword(s)

Rules keyword(s) define the **logic to follow**, if your transition should play when leaving the `current.container`, using `from`, and/or when entering the `next.container`, using `to`:

```js
barba.init({
  transitions: [{
    name: 'custom-transition',
    from: {
      // set of conditions to be fulfilled
      // to play the transition
    },
    to: {
      // set of conditions to be fulfilled
      // to play the transition
    }
  }]
});
```

They must contain a set of [condition(s)](#Condition-s), and run within a priority order:

| Priority | Keyword             | Rule apply to...                    | Rule apply when...                                |
| -------- | ------------------- | ----------------------------------- | ------------------------------------------------- |
| 1        | `from` **AND** `to` | `current` **AND** `next` containers | Condition(s) of `from` **AND** `to` are fulfilled |
| 2        | `to`                | `next` container                    | Condition(s) of `to` is/are fulfilled             |
| 3        | `from`              | `current` container                 | Condition(s) of `from` is/are fulfilled           |

> Note that you can use `from` and `to` properties **independently**.

### Condition(s)

Rules condition(s) define the **logic to fulfilled** inside [keyword(s)](#Keyword-s) in order to play the transition.

They are defined within keyword(s):

```js
barba.init({
  transitions: [{
    name: 'custom-transition',
    from: {
      namespace: [
        'home'
      ]
    }
  }]
});
```

Condition(s) can be applied to a namespace, route or through a custom function.
Barba will then select the right transition to use and play it **only if all conditions are fulfilled**.

| Priority | Condition   | Type               | Argument                                            | Fulfilled when...          |
| -------- | ----------- | ------------------ | --------------------------------------------------- | -------------------------- |
| 1        | `custom`    | Function           | [data](/docs/advanced/hooks/#data-argument) argument | Return `true`              |
| 2        | `route`     | String \| String[] | _none_                                              | `current.route.name` match |
| 3        | `namespace` | String \| String[] | _none_                                              | `current.namespace` match  |

> Any conditions can be used within `from` and/or `to` keywords.

### Priority

The "transition resolution" follows this steps:

1. Condition(s) priority
2. Keyword(s) priority
3. Declaration order

> The common/default behaviour is to start **leave** as soon as possible.
> Then **enter** will be called when **leave** ends _AND_ next page is "available": fetched or cached.
>
> If you use some `to` logic, Barba can not predict and select the right transition until the next page is available. This also applies when using the [sync mode](#Sync-mode), but this does not apply if `to` is used with `route` property because "next route" is known when the click occurs.
>
> Bear with this!

### Multiple rules

You can combine **multiple rules** on each transition.
Here is an example of what you could do with multiple rules:

```js
barba.init({
  transitions: [{
    name: 'custom-transition',
    from: {

      // define a custom rule based on the trigger class
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

      // define rule based on multiple namespaces
      namespace: [
        'home',
        'item'
      ]
    }
  }]
});
```

Based on the [priority order](#Priority), Barba will play the `custom-transition`:

- if the link you clicked on contains a `.use-custom-transition` CSS class
- if you come **from** the `index` or `product` route
- if you are navigating **to** the `home` or `item` namespace AND **from** the `index` or `product` route

## Sync mode

A mode that indicates whether **leave** and **enter** hooks should "play together".
The **sync mode is disabled by default**, but you can easily enable it using the `sync` option:

```js
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

This involves **waiting until the next page is available**: fetched or cached.

In another words, regarding the [legacy example](/docs/getstarted/legacy/), if you have an opacity transition from `1 -> 0` for `leave` and `0 -> 1` for `enter`:
- using `sync: false` will play the `leave` transition first, making your page content goes transparent, then play the `enter` transition, making the next page content goes opaque _(two step transition)_
- using `sync: true` will make the current page goes transparent while the next page becomes opaque at the same time _(crossfade transition)_
