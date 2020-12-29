---
subtitle: Lifecycle
namespace: docs
layout: components/docs/docs
url: 'docs/getstarted/lifecycle/'
---

# Lifecycle

Barba makes your site work like a *Single Page Application* (SPA), allowing you to create smooth transitions **without having to reload the whole site**.

## How it works?

Barba's default behavior:
- [prefetch](/docs/advanced/strategies/#Prefetch) the next page
- store it in the [cache](/docs/advanced/strategies/#Cache)
- add the `data-barba="container"` of the next page at the end of the `data-barba="wrapper"` element
- remove the current `data-barba="container"` from the DOM when transition is done

Here is a small diagram that describe **Barba's main concept** when navigating between two pages:

<a href="/assets/diagram/lifecycle.png" target="_blank">
  <img src="/assets/diagram/lifecycle.png" alt="Lifecycle diagram"/>
</a>

> Note that using the `sync` property will end in a different page lifecycle, see transition [sync mode](/docs/advanced/transitions/#Sync-mode).

During the transition process, **Barba doesn't apply any styles to the container**: you need to manage it by yourself with an animation library, this is where the magic happen! Be sure to take a look at the recipes to discover how to properly [manage containers](/docs/advanced/recipes/#Manage-containers).
