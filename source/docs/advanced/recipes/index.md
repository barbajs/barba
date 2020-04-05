---
subtitle: Recipes
namespace: docs
layout: components/docs/docs
url: 'docs/advanced/recipes/'
---

# Recipes

## Debug with Barba

### `debug`

This property displays useful `console.info` about transition used, for **debugging purpose** only.
It sets [logLevel](#logLevel) to `debug`. Default is `off`.

Enable it like this:

```js
barba.init({
  debug: true
});
```

> We recommend you to **enable the debugger only in development environment** to properly catch transition errors

### `logLevel`

When debugging with Barba, you can easily set the log level of debug informations that the browser display:

- `off` → log is disabled
- `error` → use `console.error()`
- `warning` → use `console.warn()`
- `info` → use `console.info()`
- `debug` → use `console.log()`

Use this syntax to adjust the log level:

```js
barba.init({
  logLevel: 'error'
});
```

## Manage browser requests

### `requestError`

Allows you to **catch request errors**.
If this function returns `false`, wrong links will not be "force" triggered.

| Argument   | Type                           | Description                                                                                                                                                     |
| ---------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger`  | HTMLElement                    | The clicked/hovered HTMLElement                                                                                                                                 |
|            | String `'barba'`               | Programmatic navigation                                                                                                                                         |
|            | String `'back'` \| `'forward'` | Browser backward/forward button                                                                                                                                 |
| `action`   | String                         | The user action on the link: `'enter'` when hovering, `'click'` when clicking, or `'prefetch'` when prefetching with [@barba/prefetch](/docs/plugins/prefetch/) |
| `url`      | String                         | Requested URL                                                                                                                                                   |
| `response` | Object                         | Fetch error with `message` or response with `status`, `statusText`, etc.                                                                                        |

Here is an example to manage 404 server responses with a custom page:

```js
barba.init({
  requestError: (trigger, action, url, response) => {
    // go to a custom 404 page if the user click on a link that return a 404 response status
    if (action === 'click' && response.status && response.status === 404) {
      barba.go('/404');
    }

    // prevent Barba from redirecting the user to the requested URL
    // this is equivalent to e.preventDefault() in this context
    return false;
  },
});
```

> Note that if you use `barba.go()` directive without returning `false`, you will be redirected to the requested URL because Barba uses `barba.force()` to reach the page

### `timeout`

On slow network or with a high page weight, the server can take time to give a response to the user. In case the page take **more than timeout** to be loaded, it lead Barba to abort the transition and display a _Timeout error_ message.

To prevent this behavior, you can increase the `timeout`:

```js
barba.init({
  timeout: 5000
});
```

In addition, you can properly catch the error by using the [`requestError`](#requestError) callback.

## Partial output

Barba sends a custom **HTTP Header** named `x-barba` in the `XMLHttpRequest`.

If you are using a server side language like PHP, you can detect this custom HTTP Header and output just the container instead of the entire page: this could result in **less bandwidth usage** and **less server-side load**.

```php
<?php
  // check for the server side x-barba request header
  if (isset($_SERVER['HTTP_X_BARBA'])) {

    // this content will only be displayed if the page is called with BarbaJS
    echo "I ❤ Barba";
  }
?>
```

> Note that doing so, you have to manually handle the update of the page `title`
