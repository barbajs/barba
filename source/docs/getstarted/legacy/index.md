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

You need **at least two pages** to make a Barba transition:

- `index.html`, the homepage of the website

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Index — BarbaJS legacy example</title>
  </head>
  <body>

    <!-- base styles to prevent container from moving during transition -->
    <style media="screen">
      [data-barba="container"] {
        position: absolute;
        font-family: monospace;
      }
    </style>

    <!-- define the wrapper and the container -->
    <div data-barba="wrapper">
      <div data-barba="container" data-barba-namespace="home">
        <h1>Home</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <a href="about.html">About</a>
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
        }],
      });
    </script>
  </body>
</html>
```

- `about.html`, another page of the website

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>About — BarbaJS legacy example</title>
  </head>
  <body>
    <div data-barba="wrapper">
      <div data-barba="container" data-barba-namespace="about">
        <h1>About</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <a href="index.html">Go back home</a>
      </div>
    </div>

    <!-- no need to add scripts on the other page since Barba doesn't reload browser between pages -->
  </body>
</html>
```

> Be sure to read the [markup section](/docs/getstarted/markup/) before diving into Barba.
