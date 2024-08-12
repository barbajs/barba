---
title: Install
namespace: docs
layout: components/docs/docs
url: 'docs/getstarted/install/'
---

# Install

Want to try Barba? Let's install it!

## Use with a bundler

Barba is published on the **NPM registry**, so you can install it through the command line interpreter using your favorite package manager. This is the best way to install the library if you are comfortable with **javascript bundlers** like `webpack` or `rollup`.

```sh
# npm
npm install @barba/core

# yarn
yarn add @barba/core
```

Then **import it like any other module** inside your build:

```js
import barba from '@barba/core';

barba.init({
  // ...
});
```

> See the list of [all available options](/docs/advanced/options/).
>
> Using a bundler has **many advantages** like output compression, code splitting, tree shaking, etc., so we encourage you to use this kind of tool with Barba.

## Use with a CDN

<div class="info">
<strong>⚠️ IMPORTANT NOTE</strong>
<p>Be aware when using a Content Delivery Network: this can lead to issues such as <strong>library downtime unavailability, website latency and bugs</strong> that could be introduced in new releases. You should bundle the library with your scripts using a specific tagged version, not only using `@barba/core` tag from the CDN as well. This is true for all the libraries you are using through a CDN, not only BarbaJS. Read more about CDNs <a href="https://web.dev/articles/content-delivery-networks?hl=fr" target="_blank">in this great article from Google</a>.</p>
</div>

To rapidly **include the minified production file** in your webpage, load the latest build from your favorite CDN using a generic script markup:

```html
<!-- unpkg -->
<script src="https://unpkg.com/@barba/core"></script>

<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/@barba/core"></script>
```

Then init Barba:

```html
<script>
  barba.init({
    // ...
  })
</script>
```

> See the list of [all available options](/docs/advanced/options/).
>
> By default, if no one is specified, the CDN will automatically target the **@latest** version of Barba and load the **UMD build** from `dist/barba.umd.js`.

## Other setup

Barba is build upon `microbundle` and is provided with an **ESM** and **Modern** version include in the package `dist` folder.
