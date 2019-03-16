# barba.js <small>[v2]</small>

![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/github/epicagency/barba/master.svg?style=flat-square)](https://travis-ci.com/epicagency/barba)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/barbajs/barba/blob/master/LICENSE)
[![Slack channel](https://img.shields.io/badge/slack-channel-purple.svg?style=flat-square&logo=slack)](https://barbajs.slack.com)

> [Invite link to slack channel](https://join.slack.com/t/barbajs/shared_invite/enQtNTU3NTAyMjkxMzAyLTI1NDIxZDZmMGJjMDlmNzFkODZmMmVmN2U2ODg2Y2M3MzczMDdjZTk5ODQwNWZkYWVlMDM5NGZiODJmMWVhODk)
>
> **Barba** is a small (8kb minified and gzipped) and easy-to-use library that helps you creating fluid and smooth transitions between your website's pages.

It helps reducing the delay between your pages, minimizing browser HTTP requests and enhancing your user's web experience.

> This is beta version, use it at your own risks! 😱<br>
> Thanks in advance for reporting bugs. #sharethelove 😊
>
> [Looking for v1?](https://barba.js.org/v1)

## What's new?

- Simplified API
- Hook sytem for `transitions` and `views`
- _Transition resolution_: declare your transitions and let Barba pick the right one
- Use of `data-barba` attributes
- Sync mode
- Plugin system
  - `@barba/router`: use of routes for _transition resolution_
  - `@barba/css`: automatic addition of CSS classes
  - `@barba/prefetch`: automatic pages prefetching (and caching), based on viewport
  - `@barba/head`: update your `<head>` _(coming soon)_
  - `@barba/transition`: ready-to-use basic transitions pack (fade, slide, …) _(coming soon)_

## Main changes (TL;DR)

- Barba [container](docs/v2/user/core.md#container) and [wrapper](docs/v2/user/core.md#wrapper) now use `data-barba` attribute
- Same for [namespace](docs/v2/user/core.md#namespace) via `data-barba-namespace`
- 2 main methods: `barba.init()` and `barba.use()` (for plugins)
- [Transitions](docs/v2/user/core.md#transition-object):
  - are plain JS objects
  - are declared via the `barba.init({ transitions })`
  - use "[hooks](docs/v2/user/core.md#hooks)" corresponding to animation steps
    - hooks can be synchronous or asynchronous (via `this.async()` or promise based)
    - all hooks receive same [`data` argument](docs/v2/user/core.md#data-argument)
  - use "[rules](docs/v2/user/core.md#rules)" to select which transition to use
    - default rules are `namespace` and `custom`
    - `@barba/router` adds `route` rule
    - they can be combined within `from` and `to` properties
- [Views](docs/v2/user/core.md#view-object):
  - are plain JS objects
  - are declared via the `barba.init({ views })`
  - use a subset of animation "hooks":
    - `beforeAppear`, `afterAppear`, `beforeLeave`, `afterLeave`, `beforeEnter`, `afterEnter`
    - receive the same [`data` argument](docs/v2/user/core.md#data-argument)
- [Sync mode](docs/v2/user/core.md#sync-mode) will start `leave` and `enter` transitions concurrently

## Documentation

- [Core](docs/v2/user/core.md)
- [Router](docs/v2/user/router.md)
- [Prefetch](docs/v2/user/prefetch.md)
- [Css](docs/v2/user/css.md)
- Transition _(coming soon)_
- Head _(coming soon)_

## How to contribute

If you want to report a bug or if you just want to request for a new feature/improvement, please **follow [those instructions](CONTRIBUTING.md) before**.

Thanks for taking time to contribute to Barba :tada: :+1:

## Next steps

- [ ] Testing, debugging, fixing, testing…
- [ ] e2e testing suite
- [ ] CI setup (PR, publish, …)
- [ ] Write manual documentation
- [ ] Generate code documentation
- [ ] New website
