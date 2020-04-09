---
subtitle: Utils
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/utils/'
---

# Utils

Barba is brought to you with a bunch of **useful utilities**.

- `barba.version` → Retrieve the **current @barba/core version**
- `barba.destroy()` → **Destroy the Barba instance** and properly remove `EventListener` on eligible links
- `barba.go(href: string, trigger?: Trigger, e?: LinkEvent | PopStateEvent)` → Tell Barba to **go to a specific URL** and play your transitions, if available, without using a browser "force reload"
- `barba.force(href: string)` → Force Barba to **redirect to a specific URL** without playing your transitions, equivalent to `location.href` change
- `barba.prefetch(href: string)` → Prefetch the given URL
- `barba.url.parse(url: string)` → Parse the given URL and retrieve a [`IUrlBase`](https://barba.js.org/api/modules/_core_src_utils_url_.html#parse)
- `barba.history.previous` → Get the previous history [`IStateItem`](https://barba.js.org/api/interfaces/_core_src_utils_history_.istateitem.html) object, with URL, namespace and scroll x/y positions
- `barba.history.add(url: string, trigger: Trigger)` → Add a new state in the browser history, allowing you to add "sub-URL" in the same page

> This is a draft section of **@barba/core utilities** that shows the most important you could use in your project, check the [Developer API](https://barba.js.org/api) for more informations.
