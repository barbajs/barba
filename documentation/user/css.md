---
layout: default
title: '@barba/css'
---

# @barba/css

[![NPM version](https://img.shields.io/npm/v/@barba/css?style=flat-square)](https://www.npmjs.com/package/@barba/css)
[![Dependencies](https://img.shields.io/librariesio/release/npm/@barba/css?style=flat-square)](https://github.com/barbajs/barba/network/dependencies)

Barba CSS is a **style helper** that manage you CSS classes during transitions.

It is mainly inspired by [Vue.js transitions](https://vuejs.org/v2/guide/transitions.html#Transition-Classes).

## Definition

This module adds/removes CSS classes from the `data-barba="container"` DOM element automatically. By default, it uses `.barba-xxx[-xxx]` but if you add a `name` property to your transition, it uses `.name-xxx[-xxx]` CSS classes instead.

## Usage

During the transition process, Barba defines custom classes according to the transition `once` / `leave` / `enter` hooks and the transition name, if specified. Here is the list of hooks supported by the module:

### once

- `.barba-once`: **starting state** for `once`, added when first load transition is triggered, removed one frame after.
- `.barba-once-active`: **active state** for `once`, applied during the entire appearing phase, then added when once transition is triggered and removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve.
- `.barba-once-to`: **ending state** for `once`, added one frame after transition is triggered (at the same time `barba-once` is removed) and removed when transition/animation finishes.

### leave

- `.barba-leave`: **starting state** for `leave`, added when leave transition is triggered, removed one frame after.
- `.barba-leave-active`: **active state** for `leave`, applied during the entire leaving phase, then added when leave transition is triggered and removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve.
- `.barba-leave-to`: **ending state** for `leave`, added one frame after transition is triggered (at the same time `barba-leave` is removed) and removed when transition/animation finishes.

### enter

- `.barba-enter`: **starting state** for `enter`, added when enter transition is triggered, removed one frame after next container is inserted.
- `.barba-enter-active`: **active state** for `enter`, applied during the entire leaving phase, then added after next container is inserted and removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve.
- `.barba-enter-to`: **ending state** for `enter`, added one frame after next container is inserted (at the same time `barba-enter` is removed) and removed when transition/animation finishes.

Example with default naming:

```js
import barba from '@barba/core';
import barbaCss from '@barba/css';

// tell Barba to use the css module
barba.use(barbaCss);

// init Barba
barba.init();
```

Then customize your CSS classes like this:

```css
/* transition active state (same for leave and enter) */
.barba-leave-active,
.barba-enter-active {
  transition: opacity 450ms ease;
}

/* initial state */
.barba-leave {
  opacity: 1;
}

.barba-enter {
  opacity: 0;
}

/* ending state */
.barba-leave-to {
  opacity: 0;
}

.barba-enter-to {
  opacity: 1;
}

/* Note that this code can be refactored for optimization */
```

If you want to play some transition on first load, use `once`:

```css
/* once: active state, define the transition */
.barba-once-active {
  transition: opacity 450ms ease;
}

/* once: initial state */
.barba-once {
  opacity: 0;
}

/* once: ending state */
.barba-once-to {
  opacity: 1;
}
```

---

If you want different transitions, you can name them and use rules.
The transition `name` will be used as **CSS "prefix"**.

> !!! To use a "custom named" **once** transition, you need to explicitly add a `once() {}` hook to your transition.

```js
import barba from '@barba/core';
import barbaCss from '@barba/css';

// tell Barba to use the css module
barba.use(barbaCss);

// init Barba
barba.init({
  transitions: [
    {
      // css classes will look like `.fade-xxx-[-xxx]`
      name: 'fade',

      // if you want to use `.fade-once[-xxx]`
      // add this empty hook…
      once() {},
    },
    {
      // css classes will look like `.slide-xxx[-xxx]`
      name: 'slide',
      from: {
        namespace: 'home',
      },
      to: {
        namespace: 'products',
      },
    },
  ],
});
```

```css
/* fade and slide transition active states (same for leave and enter) */
.fade-leave-active,
.fade-enter-active,
.slide-leave-active,
.slide-enter-active {
  transition: opacity 450ms ease, transform 650ms ease-in-out;
}

/* fade transition states */
.fade-leave,
.fade-enter-to {
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* slide transition states */
.slide-leave,
.slide-enter-to {
  transform: translateX(0);
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
```
