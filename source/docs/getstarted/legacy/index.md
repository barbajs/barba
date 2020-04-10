---
title: Legacy example
namespace: docs
layout: components/docs/docs
url: 'docs/getstarted/legacy/'
---

# Legacy example

This example do not use **any modern javascript syntax**, neither modules.
You can safely copy/paste this legacy code and use it as a starting point for playing with Barba.

## Code

In a web page called `index.html`, put the following code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>BarbaJS legacy example</title>
  </head>
  <body>

    <!-- define the wrapper and the container -->
    <div data-barba="wrapper">
      <div data-barba="container" data-barba-namespace="page-a">
        <h1>Home</h1>
      </div>
    </div>

    <!-- load barba (UMD version) -->
    <script src="https://unpkg.com/@barba/core"></script>

    <!-- load gsap animation library (minified version) -->
    <script src="https://unpkg.com/gsap@latest/dist/gsap.min.js"></script>

    <!-- init barba with a simple opacity transition -->
    <script type="text/javascript">
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
    </script>
  </body>
</html>
```

> In order to see the opacity transition properly run, you need to **add another page next this one** and link them together.
