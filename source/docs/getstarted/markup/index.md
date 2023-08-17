---
title: Markup
namespace: docs
layout: components/docs/docs
url: 'docs/getstarted/markup/'
---

# Markup

At the beginning, Barba needs to know a little bit about your **site architecture**.

## DOM structure

By default, you can use this markup inside your pages:

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

> Note that you can build the `html` in many ways: if your header/nav/links need to be updated along the pages, put them inside the `container`, same if you have additional links in your footer that change between pages.
>
> Keep in mind that the `wrapper` should always wrap the `container`.

### Wrapper

The wrapper is **the main Barba section** that contains all your page structure and the Barba [container](#Container). Beware, everything inside of this wrapper and outside of the container **will not be updated by Barba**: you can put your `<header>`, `<footer>` or `<nav>` safely here. It is mainly defined on the `<body>` tag, but you can add it on a `div` or `section` for example.

### Container

The container defines **a section in which content is updated automatically** when you navigate between your pages. Beware, everything inside of this container **will be updated by Barba**: you can put your `<footer>` safely here. It is mainly defined on the `<main>` tag, but you can add it on a `div` or `section` for example.

> Beware, Barba appends the container to the wrapper, so it will always end up at the bottom and if you have more DOM elements in there, they will be bumped up.

### Namespace

The namespace allows you to define **a unique name for each page**. Barba mainly uses this namespace for [Transition rules](/docs/advanced/transitions/#Rules) and [Views](/docs/advanced/views/).

## Schema

You can easily override every **data-barba** attributes.

```js
barba.init({
  schema: {
    prefix: 'data-custom',
    wrapper: 'wrap'
  }
});
```

Now you can use `data-custom="wrap"` in your HTML instead of `data-barba="wrapper"`.

> See the list of all customizable attributes in the default [`schema`](https://github.com/barbajs/barba/blob/main/packages/core/src/schemas/attribute.ts).
