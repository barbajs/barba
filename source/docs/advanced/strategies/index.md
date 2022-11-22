---
subtitle: Strategies
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/strategies/'
---

# Strategies

Barba implement **modern browser strategies** to keep your site run as fast as possible.

## Summary
1. [Cache](#Cache)
2. [Prefetch](#Prefetch)
3. [Prevent](#Prevent)
4. [History](#History)

## Cache

### `cacheIgnore`

Allows Barba to **cache your pages**.

Saving pages in the cache results in **less bandwidth usage** and **less server-side load**: no more `XMLHttpRequest` are made for pages that have already been visited.

| Value                | Description             |
| -------------------- | ----------------------- |
| `false` _(default)_  | Cache all               |
| `true`               | Ignore all              |
| `String \| String[]` | Ignore route pattern(s) |

Use it like this:

```js
barba.init({
  cacheIgnore: ['/contact/', '/:category/post?']
});
```

> Cache lifetime is **restricted to Barba instance** and will be cleared when leaving the site.

## Prefetch

### `prefetchIgnore`

Allows Barba to **prefetch your pages** on `mouseover` or `touchstart` events.

Since there is a **100-300ms delay** during the user hover and the click, Barba use this time to start prefetching the next page. Most of time, this is enough to get the next page ready.

| Value                | Description             |
| -------------------- | ----------------------- |
| `false` _(default)_  | Prefetch all            |
| `true`               | Ignore all              |
| `String \| String[]` | Ignore route pattern(s) |

Use it like this:

```js
barba.init({
  prefetchIgnore: '/home/'
});
```

> To prefetch all eligible links that **enter the viewport**, use the [@barba/prefetch](/docs/plugins/prefetch/) plugin.

## Prevent

### `preventRunning`

Tells Barba to **prevent page "force reload"** when the user clicks on an eligible link during a transition is running.
This option is useful if you don't want your users to break running transitions, especially if they are long.

```js
barba.init({
  preventRunning: true
});
```

> You can also programmatically check if a transition is running using `barba.transitions.isRunning` whenever you want in your code.

### `prevent`

Allows you to add a **custom "prevent" test** on eligible links.
If this function returns `true`, Barba will be disable for links that pass the test.

| Argument | Property | Description     |
| -------- | -------- | --------------- |
| Object   | `el`     | Clicked element |
|          | `event`  | Triggered event |
|          | `href`   | Next page href  |

```js
barba.init({
  // define a custom function that will prevent Barba
  // from working on links that contains a `prevent` CSS class
  prevent: ({ el }) => el.classList && el.classList.contains('prevent')
});
```

> Note that you can prevent a link from using Barba with the `data-barba-prevent` attribute:
>
> 1. `data-barba-prevent` or `data-barba-prevent="self"` prevents the current link
> 2. `data-barba-prevent="all"` prevents all children links in a container (`div`, `p`, etc.)

## History

### `barba.history`

While browsing the website, Barba stores useful navigation informations into the `history` property. You can **access those informations at any time** in your application.

#### `history.previous|current`

The most useful are the `previous` and `current` history attributes. It allows you to access the page `namespace`, the window `scroll` position and the page `url`. For example, if you want to restore scroll position between pages, have a look at the [scroll position](/docs/advanced/recipes/#Scroll-position) recipe.

They both shares the same set of properties.

| Property | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| `ns`     | String | Namespace of the page             |
| `scroll` | Object | `x` / `y` positions of the scroll |
| `url`    | String | URL of the history position       |

> Be careful, `barba.history.previous` object equals `null` when your application is starting.

### `data-barba-history`

Sometimes, you may want to "alter" the browser history by **replacing the current entry without having to push a new one**. This can easily be done with the `data-barba-history="replace"` attribute.

In the example below, if you come from the `index` page and click on `black` link, the `barba.history.previous` will equal `index` while `barba.history.current` will equal `black`. Clicking on `white` will replace the current `black` entry with the `white` one, while the previous entry remains intact and equal to `index`.

```html
<a href="/theme?color=black" data-barba-history="replace">black</a>
<a href="/theme?color=white" data-barba-history="replace">white</a>
```

> The default Barba behavior for history is `push`, so you don't have to manually write `data-barba-history="push"` on all your links.
>
> As of today, `data-barba-history="replace"` is the only way to properly replace a state into the `window.history`: this will evolve in the next release.
