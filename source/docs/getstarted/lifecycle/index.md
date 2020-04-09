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
- prefetch the next page
- store it in the cache
- add `barba-container` of the next page inside the `barba-wrapper` element
- remove the current page content from the DOM when transition is done

Here is a small diagram that describe **Barba's main concept** when navigating between two pages:

![Lifecycle diagram](/assets/diagram/lifecycle.png)

> Note that using the `sync` property will end in a different page lifecycle, see transition [sync mode](/docs/advanced/transitions#Sync-mode)

During the transition process, **Barba doesn't apply any styles on the wrapper or container**: you need to manage it by yourself with an animation library, this is where the magic happen!
