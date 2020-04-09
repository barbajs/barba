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

> Using a bundler has **many advantages** like output compression, code splitting, tree shaking, etc., so we encourage you to use this kind of tool with Barba

## Use with a CDN

To rapidly **include the minified production file** in your webpage, load the latest build from your favorite CDN using a generic script markup:

```html
<!-- unpkg -->
<script src="https://unpkg.com/@barba/core"></script>

<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/@barba/core"></script>
```

> By default, if no one is specified, the CDN will automatically target the **@latest** version of Barba and load the **UMD build** from `dist/barba.umd.js`

## Other setup

Barba is build upon `microbundle` and is provided with an **ESM** and **Modern** version include in the package `dist` folder.
