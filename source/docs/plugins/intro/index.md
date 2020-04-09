---
title: CSS
namespace: docs
layout: components/docs/docs
url: 'docs/plugins/intro/'
---

# Plugins

Barba plugins are **components that you can plug** to improve the default library behavior.

## Available

Here is the list of all available plugins for Barba:

- [@barba/router](/docs/plugins/router/) → allows you to use custom routes for page transitions
- [@barba/prefetch](/docs/plugins/prefetch/) → prefetches automatically and cache your pages
- [@barba/css](/docs/plugins/css/) → a style helper that manage you CSS classes during transitions
- [@barba/head](/docs/plugins/head/) → keep your `<head>` up to date _**(coming soon)**_
- [@barba/preset](/docs/plugins/preset/) → ready-to-use basic transitions pack _**(coming soon)**_

## Usage
To use a plugin, simply tell Barba what plugin(s) you want to use **before initialize** it:

```js
import barba from '@barba/core';
import prefetch from '@barba/prefetch';

// tell Barba what plugins to use
barba.use(prefetch);

// init Barba
barba.init({
  ...
});
```
