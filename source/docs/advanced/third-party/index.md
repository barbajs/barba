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

## Google Analytics

### analytics.js

With `analytics.js`, you can manually send a pageview with the following snippet.
The best place to do that is in the `after` [global hook](/docs/advanced/hooks/#Global-hooks), as it is applied to all your pages:

```javascript
barba.hooks.after(() => {
  ga('set', 'page', window.location.pathname);
  ga('send', 'pageview');
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

When using smooth scrolling, as Barba duplicate containers in the DOM in order to make a transition, **two LocomotiveScroll containers may be present at the same time...** making hard for the library to target the more relevant. Here is how you can easily deal with that:

```html
<body data-barba="wrapper">
  <main data-barba="container" data-barba-namespace="home">
    <div data-scroll-container>
      <!-- page content to scroll here -->
    </div>
  </main>
</body>
```

```javascript
let scroll;

barba.init({
  transitions: [{
    name: 'custom-transition',
    once({ next }) {

      // init LocomotiveScroll on page load
      smooth(next.container);
    },
    beforeEnter({ next }) {

      // destroy the previous scroll
      scroll.destroy();

      // init LocomotiveScroll regarding the next page
      smooth(next.container);
    }
  }]
});

function smooth(container) {
  scroll = new LocomotiveScroll({
    el: container.querySelector('[data-scroll-container]'),
    smooth: true
  });
}
```

> The LocomotiveScroll implementation really depends on where you set the `data-scroll-container` attribute: it can be whenever you want on the page, no matter outside or inside Barba wrapper/container, but keep in mind that **when using it inside the Barba container, it will be duplicated**. Bear with this!
>
> Note that this code assume that you have the `data-scroll-container` attribute on every pages, so you need to add the appropriate checks if LocomotiveScroll is not used on the whole site.

## Other third party scripts

This is a draft section that **may evolve in time**, and many other important third party scripts will be added.

> Don't hesitate to **ask the Barba team [on Slack](https://barbajs.slack.com/)** if you want to request one to be present on this page.
