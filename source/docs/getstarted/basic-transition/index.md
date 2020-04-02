---
title: Basic transition
namespace: docs
layout: components/docs/docs
url: 'docs/getstarted/basic-transition/'
---

# Basic transition

## Syntax

One of the most important thing that you will use is `transitions`. Barba allows you to define **global transitions**, that run everywhere on your site, and/or **specific transitions** that can be used for navigating from one page to another.

A basic transition is made of a `leave` animation, that is executed when leaving the current page, and an `enter` animation that is executed when entering the next page:

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

> Take a look at the [lifecycle diagram](/docs/advanced/lifecycle/) to understand when `leave` and `enter` hooks are triggered during your page transition

## Animation

The important part for a good transition is animation. As **Barba is not an animation library**, you will need to import one in order to animate elements on the interface to create your transition.

There is a lot of javascript animation libraries on the web, here is a good start:
- [gsap](https://greensock.com/gsap/) — *professional-grade animation for the modern web*
- [popmotion](https://popmotion.io/) — *simple libraries for delightful interfaces*
- [animejs](https://animejs.com/) — *a lightweight library with a simple and powerful API*
- [mojs](https://mojs.github.io/) — *the motion graphics toolbelt for the web*
- [spirit](https://spiritjs.io/) — *the ultimate tool to create high-quality animations directly in the browser*

For the demonstration, here is a basic **opacity transition** with gsap that consist of making the current page transparent, while the next page become opaque:

```js
barba.init({
  transitions: [{
    name: 'opacity-transition',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0
      });
    },
    enter(data) {
      return gsap.from(data.next.container, {
        opacity: 0
      });
    }
  }]
});
```

There is **a lot of syntaxes** that you can use when running your animation transitions. Take a look at the [advanced transitions guide](/docs/advanced/transitions/) to learn more.
