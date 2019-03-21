---
layout: default
title: User guide
---

# barba.js <small>[v2]</small>

## Getting started (legacy)

> This example does not use any modern JS syntax neither modules…

### Prepare your HTML

```html
<div data-barba="wrapper">
  <div data-barba="container" data-barba-namespace="home">
    <!-- put here the content you wish to change between your pages -->
  </div>
</div>
<!-- Load some animation library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.2/TweenMax.min.js"></script>
<!-- Load barba.js -->
<script src="https://unpkg.com/@barba/core@next"></script>
<!-- Load your scripts -->
<script src="your-main-script-file.js"></script>
```

```js
// Init barba with a default "opacity" transition
barba.init({
  transitions: [
    {
      name: 'legacy-example',
      leave: function(data) {
        var done = this.async();
        TweenMax.to(data.current.container, 1, {
          opacity: 0,
          onComplete: done,
        });
      },
      enter: function(data) {
        var done = this.async();
        TweenMax.from(data.next.container, 1, {
          opacity: 0,
          onComplete: done,
        });
      },
    },
  ],
});
```
