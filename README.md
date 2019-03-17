# barba.js <small>[v2]</small>

![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg?style=flat-square)
[![CircleCI](https://img.shields.io/circleci/project/github/barbajs/barba/master.svg?style=flat-square)](https://circleci.com/gh/barbajs/barba/tree/master)
[![Coverage Status](https://img.shields.io/coveralls/github/barbajs/barba/master.svg?style=flat-square)](https://coveralls.io/github/barbajs/barba?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/barbajs/barba/blob/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors)
[![Slack channel](https://img.shields.io/badge/slack-channel-purple.svg?style=flat-square&logo=slack)](https://barbajs.slack.com)

> [Invite link to slack channel](https://join.slack.com/t/barbajs/shared_invite/enQtNTU3NTAyMjkxMzAyLTI1NDIxZDZmMGJjMDlmNzFkODZmMmVmN2U2ODg2Y2M3MzczMDdjZTk5ODQwNWZkYWVlMDM5NGZiODJmMWVhODk)

**Barba** is a small (8kb minified and gzipped) and easy-to-use library that helps you creating fluid and smooth transitions between your website's pages.

It helps reducing the delay between your pages, minimizing browser HTTP requests and enhancing your user's web experience.

> This is beta version, use it at your own risks! 😱<br>
> Thanks in advance for reporting bugs. #sharethelove 😊
>
> [Looking for v1?](https://barba.js.org/v1) 👈

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

- [User guide](https://barba.js.org/docs/v2/user/)
- [API documentation](https://barba.js.org/docs/v2/api/)

## How to contribute

If you want to report a bug or if you just want to request for a new feature/improvement, please **follow [those instructions](CONTRIBUTING.md) before**.

Thanks for taking time to contribute to Barba :tada: :+1:

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<ul style="display: flex; flex-wrap: wrap; margin: 0; padding: 0; list-style: none;"><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="http://luruke.com"><img src="https://avatars0.githubusercontent.com/u/61326?v=4" width="100px;" alt="Luigi De Rosa"/><br /><sup><b>Luigi De Rosa</b></sup></a><br /><a href="#ideas-luruke" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/barbajs/barba/commits?author=luruke" title="Code">💻</a> <a href="https://github.com/barbajs/barba/commits?author=luruke" title="Documentation">📖</a> <a href="#question-luruke" title="Answering Questions">💬</a> <a href="https://github.com/barbajs/barba/issues?q=author%3Aluruke" title="Bug reports">🐛</a> <a href="https://github.com/barbajs/barba/commits?author=luruke" title="Tests">⚠️</a> <a href="#review-luruke" title="Reviewed Pull Requests">👀</a> <a href="#infra-luruke" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="http://thierrymichel.net"><img src="https://avatars2.githubusercontent.com/u/806883?v=4" width="100px;" alt="Thierry Michel"/><br /><sup><b>Thierry Michel</b></sup></a><br /><a href="#ideas-thierrymichel" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/barbajs/barba/commits?author=thierrymichel" title="Code">💻</a> <a href="https://github.com/barbajs/barba/commits?author=thierrymichel" title="Documentation">📖</a> <a href="#question-thierrymichel" title="Answering Questions">💬</a> <a href="https://github.com/barbajs/barba/issues?q=author%3Athierrymichel" title="Bug reports">🐛</a> <a href="https://github.com/barbajs/barba/commits?author=thierrymichel" title="Tests">⚠️</a> <a href="#review-thierrymichel" title="Reviewed Pull Requests">👀</a> <a href="#infra-thierrymichel" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="https://www.xavierfoucrier.fr"><img src="https://avatars1.githubusercontent.com/u/2471223?v=4" width="100px;" alt="Xavier Foucrier"/><br /><sup><b>Xavier Foucrier</b></sup></a><br /><a href="#ideas-xavierfoucrier" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/barbajs/barba/commits?author=xavierfoucrier" title="Documentation">📖</a> <a href="#question-xavierfoucrier" title="Answering Questions">💬</a> <a href="https://github.com/barbajs/barba/commits?author=xavierfoucrier" title="Tests">⚠️</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="http://www.thenerodesign.com"><img src="https://avatars2.githubusercontent.com/u/858150?v=4" width="100px;" alt="Marco Grimaldi"/><br /><sup><b>Marco Grimaldi</b></sup></a><br /><a href="#design-markog85" title="Design">🎨</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="https://studio123.ca"><img src="https://avatars0.githubusercontent.com/u/22644154?v=4" width="100px;" alt="Cody Marcoux"/><br /><sup><b>Cody Marcoux</b></sup></a><br /><a href="#question-c0mrx" title="Answering Questions">💬</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="https://philiphussak.com"><img src="https://avatars1.githubusercontent.com/u/3285136?v=4" width="100px;" alt="Phil."/><br /><sup><b>Phil.</b></sup></a><br /><a href="#question-wiseoldman" title="Answering Questions">💬</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="http://www.fnool.com"><img src="https://avatars0.githubusercontent.com/u/5812801?v=4" width="100px;" alt="Giorgio Finulli"/><br /><sup><b>Giorgio Finulli</b></sup></a><br /><a href="#question-gfnool" title="Answering Questions">💬</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="https://www.thisisnota.studio"><img src="https://avatars2.githubusercontent.com/u/6507123?v=4" width="100px;" alt="Wouter"/><br /><sup><b>Wouter</b></sup></a><br /><a href="https://github.com/barbajs/barba/issues?q=author%3AWouter125" title="Bug reports">🐛</a> <a href="#question-Wouter125" title="Answering Questions">💬</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="https://selfaware.studio"><img src="https://avatars2.githubusercontent.com/u/12376535?v=4" width="100px;" alt="Mike Wagz"/><br /><sup><b>Mike Wagz</b></sup></a><br /><a href="#ideas-mikehwagz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-mikehwagz" title="Answering Questions">💬</a> <a href="https://github.com/barbajs/barba/commits?author=mikehwagz" title="Tests">⚠️</a></li><li style="flex-basis: 120px; margin: 0; padding: 10px; text-align: center;"><a href="https://www.youtube.com/c/redstapler_channel"><img src="https://avatars0.githubusercontent.com/u/16864380?v=4" width="100px;" alt="Red Stapler"/><br /><sup><b>Red Stapler</b></sup></a><br /><a href="#tutorial-theredstapler" title="Tutorials">✅</a> <a href="#video-theredstapler" title="Videos">📹</a></li></ul>

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Next steps

- [ ] Testing, debugging, fixing, testing…
- [ ] e2e testing suite
- [ ] CI setup (PR, publish, …)
- [ ] Write manual documentation
- [ ] Generate code documentation
- [ ] New website
