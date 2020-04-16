---
title: Run custom code
namespace: docs
layout: components/docs/docs
url: 'docs/getstarted/custom-code/'
---

# Run custom code

Most time, you need to run custom code on your website in order to **refresh a component, reset a library or anything else** according to the user navigation.

## Where?

Barba [`Views`](/docs/advanced/views/) is **the best place** to run custom code.
They are conditioned by a unique page [`namespace`](/docs/getstarted/markup/#Namespace).

```js
barba.init({
  views: [{
    namespace: 'home',
    before() {
      // update the menu based on user navigation
      menu.update();
    },
    enter() {
      // refresh the parallax based on new page content
      parallax.refresh();
    }
  }]
});
```

> In order to split the animation part from the standard code, we discourage you to run custom code inside [`Transitions`](/docs/advanced/transitions) as they are not designed for this.
