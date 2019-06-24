---
title: Markup
namespace: docs
layout: pages/docs
url: '/docs/userguide/markup'
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

