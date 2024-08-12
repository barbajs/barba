---
subtitle: Options
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/options/'
---

# Options

Definition of all available options for `barba.init`.

For a **deep dive** into the Barba `Core` class, please see the [developer API](https://barba.js.org/api/classes/core_src.core.html).

## Summary
1. [Syntax](#Syntax)
2. [Definition](#Definition)

## Syntax

Here is **short syntax** of all options with their defaults.

```js
barba.init({
  cacheFirstPage: false,
  cacheIgnore: false,
  debug: false,
  logLevel: 'off',
  prefetchIgnore: false,
  prevent: null,
  preventRunning: false,
  schema: [[SchemaAttribute]],
  timeout: 2e3,
  transitions: [],
  views: [],
})
```

## Definition

Barba can take some arguments in the initialization step:

| Name             | Type                   | Description                                                                                                          |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `cacheFirstPage` | _`boolean`_            | Disable cache on the first rendered page, see [`cacheFirstPage`](/docs/advanced/strategies/#cacheFirstPage) strategy |
| `cacheIgnore`    | _`IgnoreOption`_       | Disable cache or ignore some routes, see [`cacheIgnore`](/docs/advanced/strategies/#cacheIgnore) strategy            |
| `debug`          | _`boolean`_            | Enable [`debug`](/docs/advanced/recipes/#debug) mode                                                                 |
| `logLevel`       | _`keyof LogLevels`_    | Set custom [log level](/docs/advanced/recipes/#logLevel) for fine-grained debugging                                |
| `prefetchIgnore` | _`IgnoreOption`_       | Disable prefetch or ignore routes, see [`prefetchIgnore`](/docs/advanced/strategies/#prefetchIgnore) strategy        |
| `prevent`        | _`PreventCheck`_       | Set custom [`prevent`](/docs/advanced/strategies/#prevent) check                                                     |
| `preventRunning` | _`boolean`_            | Prevent click when transition is running, see [`preventRunning`](/docs/advanced/strategies/#preventRunning) strategy |
| `requestError`   | _`RequestCustomError`_ | Set custom [`request error`](/docs/advanced/recipes/#requestError)                                                   |
| `schema`         | _`ISchemaAttribute`_   | Set custom [`schema`](/docs/getstarted/markup/#Schema) to override `data-barba` attributes                           |
| `timeout`        | _`number`_             | Request [`timeout`](/docs/advanced/recipes/#timeout)                                                                 |
| `transitions`    | _`ITransitionPage[]`_  | Array of [`Transitions`](/docs/advanced/transitions/)                                                                |
| `views`          | _`IView[]`_            | Array of [`Views`](/docs/advanced/views/)                                                                            |

> All arguments inherit from [`IBarbaOptions`](https://barba.js.org/api/interfaces/core_src_defs.ibarbaoptions.html) interface.
