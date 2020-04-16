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

## Other third party scripts

This is a draft section that **may evolve in time**, and many other important third party scripts will be added.

> Don't hesitate to **ask the Barba team [on Slack](https://barbajs.slack.com/)** if you want to request one to be present on this page.
