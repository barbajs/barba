---
subtitle: Views
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/views/'
---

# Views

Views allows you to have **some logic related to the content of a [`namespace`](/docs/getstarted/markup/#Namespace)**.
It's a good place to init or destroy things, making the code run in a confined place.

They use a subset of [base `hooks`](/docs/advanced/hooks/#Base-hooks).

## Syntax

```js
barba.init({
  views: [{
    namespace: 'index',
    beforeLeave(data) {
      // do something before leaving the current `index` namespace
    }
  }, {
    namespace: 'contact',
    beforeEnter(data) {
      // do something before entering the `contact` namespace
    }
  }]
});
```

> Keep in mind that a view is always related to **a unique namespace**.

## Programmatic use

In some cases, you may want to **programmatically call a `View`** inside your code, this is possible since Barba store all your views by [`namespace`](/docs/getstarted/markup/#Namespace) internally.

```js
// return all views as a Map
const views = barba.views.byNamespace;

// get the view of the `home` namespace
const homeView = views.get('home');

// call the home `afterEnter` view
homeView.afterEnter();
```
