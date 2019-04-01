---
layout: default
title: '@barba/css'
---

# @barba/css

Barba CSS is a **style helper** that manage you CSS class during transitions.

It is mainly inspired by [Vue.js transitions](https://vuejs.org/v2/guide/transitions.html#Transition-Classes).

## Definition

This module adds/removes CSS classes from the `data-barba="container"` DOM element automatically. By default, it uses `.barba-xxx[-xxx]` but if you add a `name` property to your transition, it uses `.name-xxx[-xxx]` CSS classes instead.

## Usage

During the transition process, Barba defines custom classes according to the transition `appear` / `leave` / `enter` hooks and the transition name, if specified. Here is the list of hooks supported by the module:

### appear

- `.barba-appear`: **starting state** for `appear`, added when appear transition is triggered, removed one frame after.
- `.barba-appear-active`: **active state** for `appear`, applied during the entire appearing phase, then added when appear transition is triggered and removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve.
- `.barba-appear-to`: **ending state** for `appear`, added one frame after transition is triggered (at the same time `barba-appear` is removed) and removed when transition/animation finishes.

### leave

- `.barba-leave`: **starting state** for `leave`, added when leave transition is triggered, removed one frame after.
- `.barba-leave-active`: **active state** for `leave`, applied during the entire leaving phase, then added when leave transition is triggered and removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve.
- `.barba-leave-to`: **ending state** for `leave`, added one frame after transition is triggered (at the same time `barba-leave` is removed) and removed when transition/animation finishes.

### enter

- `.barba-enter`: **starting state** for `enter`, added when enter transition is triggered, removed one frame after next container is inserted.
- `.barba-enter-active`: **active state** for `enter`, applied during the entire leaving phase, then added after next container is inserted and removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve.
- `.barba-enter-to`: **ending state** for `enter`, added one frame after next container is inserted (at the same time `barba-enter` is removed) and removed when transition/animation finishes.

Example:

```js
import barba from '@barba/core';
import barbaCss from '@barba/css';

// tells barba to use the css module
barba.use(barbaCss);

barba.init({
  transitions: [
    {
      name: 'my-transition',
    },
  ],
});
```

Then customize your CSS classes like this:

```css
.my-transition-enter {
  opacity: 0;
}

.my-transition-enter-active {
  transition: opacity 450ms ease;
}

.my-transition-enter-to {
  opacity: 1;
}
```
