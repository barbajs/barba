---
title: FAQ
namespace: faq
layout: components/page/page
---

# FAQ

Frequently Asked Questions when starting using BarbaJS.

<hr>

## Summary

- [Why Barba reload the page on same url?](#Why-Barba-reload-the-page-on-same-url)
- [How to prevent transitions to break?](#How-to-prevent-transitions-to-break)
- [Can we play leave/enter transitions at the same time?](#Can-we-play-leave-enter-transitions-at-the-same-time)
- [How to play a specific transition?](#How-to-play-a-specific-transition)
- [How to manage/reset scroll position after a transition?](#How-to-manage-reset-scroll-position-after-a-transition)
- [Where can I easily init/destroy a third party plugin?](#Where-can-I-easily-init-destroy-a-third-party-plugin)
- [How can I preload some images before loading the next page?](#How-can-I-preload-some-images-before-transitioning)
- [How can I get the current/next page informations?](#How-can-I-get-the-current-next-page-informations)
- [What about SEO concerns?](#What-about-SEO-concerns)
- [Can I use Barba inside a React/Vue/Next app?](#Can-I-use-Barba-inside-a-React-Vue-Next-app)
- [How can I contribute to Barba?](#How-can-I-contribute-to-Barba)

> **Missing a question?** Search into the [repository issues](https://github.com/barbajs/barba/issues?q=is%3Aissue) first before creating a new one. If you need further help or instant code support, join the community using the [developer link](/docs/getstarted/useful-links/#Developer). Finally, don’t hesitate to ask the Barba team [on Slack](https://barbajs.slack.com/) if you want a question to be present on this page.

### Why Barba reload the page on same url?

This is the intended behavior. When a page take time to load and reach the [request timeout](/docs/advanced/recipes/#timeout), it will reload or redirect instead of doing "nothing", which can be very frustrating for most users. Use a [`prevent` strategy](/docs/advanced/strategies/#prevent) to change this behavior.

### How to prevent transitions to break?

When a transition is running and the user click on an eligible link, you can choose whether the library break the running one or prevent the user click event to let the transition finish. Take a look at the [`preventRunning` strategy](/docs/advanced/strategies/#preventRunning).

### Can we play leave/enter transitions at the same time?

Yes of course! The `leave` and `enter` transitions can be "concurrent" and run together at the same time, like a "crossfade" transition. You can enable this per-transition using the [sync mode](/docs/advanced/transitions/#Sync-mode).

### How to play a specific transition?

When building an interactive website with Barba, you will probably need to build specific transition between specific pages. This can be achieve using single or multiple [transition rules](/docs/advanced/transitions/#Rules) based on custom/route/namespace conditions.

### How to manage/reset scroll position after a transition?

As the browser never "hard reload" the current tab when using Barba, you will need to reset the scroll position before entering a new page in order for the user to start at the top. This can easily be done using a [global `hook`](/docs/advanced/hooks/#Global-hooks). Take a look at the [scroll position](/docs/advanced/recipes/#Scroll-position) recipe for more tips.

### Where can I easily init/destroy a third party plugin?

You can initialize, refresh or destroy a third party plugin/script inside `Views`: according to the `namespace`, the associated view will be automatically called when entering or leaving the page. Get started working with views by reading the [run custom code](/docs/getstarted/custom-code/) section.

### How can I preload some images before transitioning?

Barba doesn't implement any mechanism to preload assets from the next page: you need to manage it by yourself. There is a lot of library on the net that allow you to preload/prefetch images and much more. You can take a look at the [Petr Tichy repository](https://github.com/Ihatetomatoes/barbajs-demos/tree/master/barbajs-gsap-imagesLoaded) that implement the `imagesLoaded` library.

### How can I get the current/next page informations?

The current/next page informations are passed to all hooks, through the [`data` argument](/docs/advanced/hooks/#data-argument). Note that according to the lifecycle, rules, sync mode or cache availability, some properties may be `undefined`.

### What about SEO concerns?

Barba care about automatically updating the document `title` when navigating between your pages, mainly to keep a good user experience and know on which page you are. When your website is crawled by search engines or bots, the correct metadata will be loaded. Knowing this, there is no need to update your page metadata keywords/description.

### Can I use Barba inside a React/Vue/Next app?

When using a front-end framework like **React, Vue or Next**, you should take a look at the framework documentation and use everything the framework is bringing you, like page transitions, routes, etc. instead of trying to implement another library over a complex framework layout.

### How can I contribute to Barba?

If you want to report a bug or request a new feature/improvement, please **read the project [contributors guidelines](https://github.com/barbajs/barba/blob/main/.github/CONTRIBUTING.md) before**. Thanks for taking time to contribute to Barba 🎉👍.
