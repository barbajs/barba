---
title: Analytics
namespace: docs
layout: components/docs/docs
url: 'docs/userguide/analytics/'
---


# Analytics

Using Barba means that your website it's going to behave like a **SPA** *(Single Page Application)*. All your inline `<script>` will be executed once, and they won't be executed after a page change done through barba.

This might be result in some unexpected behavior when using classic tracking methods or thirdy part scripts such as Google Analytics.

We encourage you to check the specific documentation provided by the vendors on how handle Single Page Applications (or HTML Pushstate API in general).


## analytics.js

With `analytics.js` you can manually send a pageview with the following snippet:


```javascript
barba.hooks.after(() => {
  ga('set', 'page', window.location.pathname);
  ga('send', 'pageview');
});
```
see [here](https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications) for more details.


## Google Tag Manager

Although you can manually send a page view, GTM has a `History change trigger` made specifically to track virtual pageview in SPA. See [here](https://support.google.com/tagmanager/answer/7679322) for more info.


## Useful links:

- [Fix rogoue referral with GTM](https://www.simoahava.com/gtm-tips/fix-rogue-referral-problem-single-page-sites/)