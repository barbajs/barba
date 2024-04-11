---
subtitle: Third party scripts
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/third-party/'
---

# Third party scripts

Using Barba means that your site is going to behave like a **SPA** *(Single Page Application)*, so all your inline scripts will be executed once, and they won't be executed after a page change done through Barba.

This might be result in some **unexpected behaviors** when using classic third party scripts.

> We encourage you to **check the specific documentation provided by the vendors** on how handle *Single Page Applications* or *HTML Pushstate API* in general.

## Summary
1. [Google Analytics](#Google-Analytics)
2. [Google ReCaptcha](#Google-ReCaptcha)
3. [Locomotive scroll](#Locomotive-scroll)
4. [Lenis scroll](#Lenis-scroll)
5. [Scroll Trigger](#Scroll-Trigger)
6. [WordPress](#WordPress)

## Google Analytics

### GA4

With `Google Analytics 4`, you can manually send a `pageview` with the following snippet.
The best place to do that is in the `after` [global hook](/docs/advanced/hooks/#Global-hooks), as it is applied to all your pages:

```javascript
// disable automatic page view
gtag('config', GTAG_ID, {
  send_page_view: false,
});

// after each transition, push page_view event to Analytics
barba.hooks.after(() => {
  gtag('event', 'page_view', {
    'page_title': document.title,
    'page_location': location.href,
    'page_path': location.pathname,
  });
});
```
> See [Google SPA guide](https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications) for more details.

### Google Tag Manager

Although you can **manually send a page view**, as Google Tag Manager has a `History change trigger` made specifically to track virtual `pageview` in SPA.

> See [Google Tag Manager support center](https://support.google.com/tagmanager/answer/7679322) for more details.
>
> Know issue: [How to fix rogue referral with Google Tag Manager](https://www.simoahava.com/gtm-tips/fix-rogue-referral-problem-single-page-sites/)

## Google ReCaptcha

Start by [generating your public/private keys](https://www.google.com/recaptcha/admin/create) and add the script inside your page:

```html
<script src="https://www.google.com/recaptcha/api.js?render=RECAPTCHA_PUBLIC_KEY"></script>
```

Then generate the captcha **on the appropriate page** using a [`View`](/docs/advanced/views/):

```javascript
barba.init({
  views: [{
    namespace: 'index',
    beforeEnter() {
      grecaptcha.ready(() => {
        grecaptcha.execute(key, {
          action: 'captcha_index'
        }).then((token) => {
          // send token to your backend in order to check the captcha:
          // you will need to make a POST request with token and private key
          // see https://developers.google.com/recaptcha/docs/verify#api_request
        });
      });
    }
  }
});
```

> Be sure to call `grecaptcha.ready()` after adding the reCaptcha `script`.
>
> See [Google reCAPTCHA v3 guide](https://developers.google.com/recaptcha/docs/v3) for more details.

## Locomotive scroll

This library is **well compatible with Barba**, but you can encounter issues when implementing it. You need to deal with your page template, Barba lifecycle and LocomotiveScroll settings.

Having absolute or fixed elements on your page could end in a bad height calculation from LocomotiveScroll, in this case, always put the `data-scroll-container` attribute on the section of your site that scroll, defaults is `window.document`.

### Viewport detection
When only using viewport detection, you can implement it this way:

```javascript
const scroll = new LocomotiveScroll();

barba.hooks.after(() => {
  scroll.init();
});

barba.init();
```

> Using a global hook allows you to **reset the scroll in order to detect DOM elements** to observe on the next page.

### Smooth scroll

When using smooth scrolling, the more relevant solution is to nest the `data-barba="container"` inside the `data-scroll-container`, like this:

```html
<body data-barba="wrapper">
  <div data-scroll-container>
    <main data-barba="container" data-barba-namespace="home">
      <!-- page content -->
    </main>
  </div>
</body>
```

```javascript
// init LocomotiveScroll on page load
let scroll = new LocomotiveScroll({
  el: container.querySelector('[data-scroll-container]'),
  smooth: true
});

// update the scroll after entering a page
barba.hooks.after(() => {
  scroll.update();
});
```

> The LocomotiveScroll implementation really depends on where you set the `data-scroll-container` attribute: it can be whenever you want on the page, no matter outside or inside Barba wrapper/container, but keep in mind that **when using it inside the Barba container, it will be duplicated**. Bear with this!
>
> Note that this code assume that you have the `data-scroll-container` attribute on every pages, so you need to add the appropriate checks if LocomotiveScroll is not used on the whole site.

### Hooks workflow

Inside a SPA, **it's not needed to have multiple instance of LocomotiveScroll**, but in order to properly update it, it's necessary to use Barba hooks to have a consistent result when transitioning.

```javascript
const scroll = new LocomotiveScroll();

// lock the scroll to prevent further animations when transitioning
barba.hooks.before(() => {
  scroll.stop();
});

// reset scroll position and update the scroll when the next page is fetched
barba.hooks.enter(() => {
  scroll.scrollTo({
    offset: 0,
    smooth: false,
    disableLerp: true,
    duration: 0
  });

  scroll.update();
});

// unlock the scroll, in order to let the user be able to scroll again
barba.hooks.after(() => {
  scroll.start();
});
```

> Depending on what's inside your website, you can also reset/update the LocomotiveScroll instance inside the Barba `after` hook instead.


## Lenis scroll

Unlike LocomotiveScroll that uses scroll hijacking, Lenis is using browser **native scrolling**, meaning you don't have to update/refresh it between your website pages. It's simple as this:

```javascript
import barba from '@barba/core';
import Lenis from '@studio-freight/lenis';

// init lenis
const lenis = new Lenis({
  lerp: 0.1,
  smooth: true,
});

const loop = (time) => {
  lenis.raf(time);
  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

// init barba
barba.init();

```

> Note that if you link Lenis with [ScrollTrigger](#Scroll-Trigger), you will need to **deal with triggers**.


## Scroll Trigger

There are **no specific issues** when trying to implement this library in a website that uses Barba. Depending on how your website animations are shared along all your pages, and also how you have planned to deal with scroll "triggers", you may prefer using a view hook instead of a global hook.

### View hook

```html
<body data-barba="wrapper">
  <div data-scroll-container>
    <main data-barba="container" data-barba-namespace="home">
      <!-- put content here to have a scrollbar -->
      <div class="scrolltrigger-element">
        <p>This element is animated by ScrollTrigger</p>
      </div>
      <!-- put content here to have a scrollbar -->
    </main>
  </div>
</body>
```

```javascript
import barba from '@barba/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// global instance
const instance;

// init barba
barba.init({
  views: [{
    namespace: 'home',
    beforeEnter() {

      // get the element you want to animate
      const element = document.querySelector('.scrolltrigger-element');

      // create a basic timeline
      const timeline = gsap.to(element, {
        x: 500,
        duration: 2
      });

      // create instance each time you enter the page
      instance = ScrollTrigger.create({
        animation: timeline,
        trigger: element,
        start: 'center 75%',
        markers: true
      });
    },
    afterLeave() {

      // kill instance each time you leave the page
      instance.kill();
    },
  }]
});
```

> Keep in mind that **it is very important to kill ScrollTrigger instances** when navigating between two pages, otherwise your instances will overlap together.


## WordPress

### Update `body` classes

When using the **WordPress CMS** you might notice that `body` classes could be different from one page to another. If you need to keep consistency between pages, you need to manually update the classes, mainly because the `body` element is placed outside of the `data-barba="container"`.

```javascript
import barba from '@barba/core';

// init barba
barba.init({
  transitions: [{
    enter() {},
    beforeEnter: ({ next }) => {
      const matches = next.html.match(/<body.+?class="([^""]*)"/i);
      document.body.setAttribute('class', (matches && matches.at(1)) ?? '');
    }
  }]
});
```

> The implementation above **replace all `body` classes** from the current page with all classes from the next page. Be sure to adapt it depending on your needs.


## Other third party scripts

This is a draft section that **may evolve in time**, and many other important third party scripts will be added.

> Don't hesitate to **ask the Barba team [on Slack](https://barbajs.slack.com/)** if you want to request one to be present on this page.
