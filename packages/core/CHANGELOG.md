# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.10.2](https://github.com/barbajs/barba/compare/@barba/core@2.10.0...@barba/core@2.10.2) (2024-08-02)

### Bug Fixes

- **core:** :bug: fix popstate when no link event is present ([680e2e7](https://github.com/barbajs/barba/commit/680e2e73c0a77186ae22112f1cefa2deef9eea04))

# [2.10.0](https://github.com/barbajs/barba/compare/@barba/core@2.9.7...@barba/core@2.10.0) (2024-05-10)

### Bug Fixes

- **core:** :bug: cache first page ([a45bc26](https://github.com/barbajs/barba/commit/a45bc2692802cbb36259604e11ad8cd680e4701f)), closes [#602](https://github.com/barbajs/barba/issues/602)
- **core:** :bug: fix `data-barba-history="replace"` attribute ([8e38a8f](https://github.com/barbajs/barba/commit/8e38a8f9097f68e92a1a18f42cf88edf1456d637))
- **core:** :bug: fix container replacement in the dom ([aec3143](https://github.com/barbajs/barba/commit/aec314365942c53497a05b857f7170e9bb0b0a44)), closes [#479](https://github.com/barbajs/barba/issues/479)
- **core:** :bug: fix DOMParser error on SSR ([cadba05](https://github.com/barbajs/barba/commit/cadba0512eb5459e325f7af82f210a92e05e24d5)), closes [#512](https://github.com/barbajs/barba/issues/512)
- **core:** :bug: fix request header name case ([167988d](https://github.com/barbajs/barba/commit/167988ddc67654675816ca39d8d28980c423d229))
- **core:** :bug: prevent `onLinkEnter` prefetch to cache relative URLs ([a7d15ac](https://github.com/barbajs/barba/commit/a7d15acb11f745107a4c11b5d783988a9eca7764))
- **core:** :bug: prevent assistive technology to read out the entire page ([4baef3e](https://github.com/barbajs/barba/commit/4baef3e8171c0e5b3dd98b8ca886e5ff811a7513)), closes [#681](https://github.com/barbajs/barba/issues/681)
- **core:** :bug: prevent programmatic prefetch to cache relative URLs ([a021236](https://github.com/barbajs/barba/commit/a021236668082a14d3c3c718acbc30ae0f5e9bdb))
- **core:** :bug: properly match `self` transition ([f7bd01c](https://github.com/barbajs/barba/commit/f7bd01cfdb333c1d0afad109a7f74d01adcb78f1))
- **core:** :bug: properly prevent `self` transition ([4c97b59](https://github.com/barbajs/barba/commit/4c97b59c86bc9e5ce9309621334d44849916299c)), closes [#700](https://github.com/barbajs/barba/issues/700)
- **core:** :pencil2: fix `this.barba` typo ([707c3de](https://github.com/barbajs/barba/commit/707c3de77152dad11e98cb10877a57965e561623))
- **core:** :pencil2: fix typos in tests ([a748356](https://github.com/barbajs/barba/commit/a748356daf77117a120783eee4750c16e7603ad2))
- **core:** :rotating_light: align asterisks for jsdoc ([ff837db](https://github.com/barbajs/barba/commit/ff837dbd2569d051164fd6f72cbad2919361cf84))
- **core:** :rotating_light: fix linter issues inside `core` ([5ae1432](https://github.com/barbajs/barba/commit/5ae1432d34a142154dc4a3928b7ab01a81ff232e))
- **core:** :rotating_light: fix maxlength line issue ([45df0d6](https://github.com/barbajs/barba/commit/45df0d696f69c2cfbeca6f764d1e5ae465b8d177))
- **core:** :rotating_light: sort imports alphabetically ([0ccbfda](https://github.com/barbajs/barba/commit/0ccbfdaf5c1a51c60240e4328b062ea8b63e3626))
- **core:** :rotating_light: sort variables alphabetically ([6c2c3d7](https://github.com/barbajs/barba/commit/6c2c3d70b6f63bb796a95d4778919707f63054a7))
- **core:** :white_check_mark: fix duplicate expect state ([085794b](https://github.com/barbajs/barba/commit/085794bac6fd32c2082c05c9d59c9135c0320b7f))
- **core:** :white_check_mark: fix request tests ([151abff](https://github.com/barbajs/barba/commit/151abff58dc8658ef251a96c3fb32db865322f6f))
- **core:** ✅ fix request tests ([79e207b](https://github.com/barbajs/barba/commit/79e207b4e7ff88c39a33f963d3833cfb9c2ba50b))
- **core:** 🐛 fix transition with popstate event and query string ([e27736f](https://github.com/barbajs/barba/commit/e27736fc305d0315cbf0a01f74a9209c8337a02e)), closes [#587](https://github.com/barbajs/barba/issues/587)
- **core:** 🚨 align asterisks for jsdoc ([811b3ab](https://github.com/barbajs/barba/commit/811b3ab0ea67933348228792b39240df01e3fe12))
- **core:** timeout reload, go to next page instead ([2b8f59a](https://github.com/barbajs/barba/commit/2b8f59a11a1440c4dc9c89126c511fbec4f4bffd))

### Features

- **core:** :sparkles: add `cacheFirstPage` option ([4306972](https://github.com/barbajs/barba/commit/43069722744822853dbc459aea5ab5a4b8bd924f))
- **core:** :sparkles: add `CacheStatus` to reflect Promise status ([61c28c7](https://github.com/barbajs/barba/commit/61c28c75fff686d19b03da3198776be293399e1b))
- **core:** :sparkles: add `CacheTarget` type ([a4e9045](https://github.com/barbajs/barba/commit/a4e9045a7ad14cf40dae7bf3084cd8e9a9e89cd7))
- **core:** :sparkles: add `getTarget` method ([1d187de](https://github.com/barbajs/barba/commit/1d187de72e11b2360b1e1f6c9f19a38d3fd94e97))
- **core:** :sparkles: add `Headers` module ([141249d](https://github.com/barbajs/barba/commit/141249d3764e5791530e265793ec72722d67958d))
- **core:** :sparkles: add `IDomSibling` interface ([d3acdb8](https://github.com/barbajs/barba/commit/d3acdb8dec3a494b5a17643312f778921155d22e))
- **core:** :sparkles: add `IResponse` interface ([c2fa15a](https://github.com/barbajs/barba/commit/c2fa15acfe3d7c8b08659dd0da5d6b409e9609ad))
- **core:** :sparkles: add a method to retrieve absolute href from URL ([ad96797](https://github.com/barbajs/barba/commit/ad967972a41a324dd9128855225f41bae6142587))
- **core:** :sparkles: allow `CacheStatus` to be retrieved ([9970f21](https://github.com/barbajs/barba/commit/9970f216c4e629783a7f2a4f828bf8ca707fc70c))
- **core:** :sparkles: allow custom `data` when adding to history ([2eaab1c](https://github.com/barbajs/barba/commit/2eaab1cf345462692951b9b09418484823e55bbb))
- **core:** :sparkles: allow custom data in `barba.history` ([920880a](https://github.com/barbajs/barba/commit/920880a8573ee9fc1eb03fd75cce08c872be0d27)), closes [#630](https://github.com/barbajs/barba/issues/630)
- **core:** :sparkles: allow programmatic `barba.history` management ([e1e4b5f](https://github.com/barbajs/barba/commit/e1e4b5f270cd9e08aa4981a89bb744a8834f41c1)), closes [#601](https://github.com/barbajs/barba/issues/601)
- **core:** :sparkles: expose `getQuery` and `getHash` methods ([4456f4b](https://github.com/barbajs/barba/commit/4456f4b7d03cd9933a0ea43dd722298be82b9088))
- **core:** :sparkles: implement `getSibling` method ([4bf2802](https://github.com/barbajs/barba/commit/4bf280265f21e4e5b6a628982d4155be0a6467a9))
- **core:** :sparkles: pass the trigger event through `hooks` ([a2fef11](https://github.com/barbajs/barba/commit/a2fef11e7947667ff6386bd1e4ef680c30aaadeb)), closes [#622](https://github.com/barbajs/barba/issues/622)
- **core:** :sparkles: properly manage server response ([ae94e2c](https://github.com/barbajs/barba/commit/ae94e2c929e20ef527f7c91fb2d006da7ae78a19))
- **core:** :sparkles: resolve `CacheRequest` with `IResponse` instead ([1061245](https://github.com/barbajs/barba/commit/106124553200a6f8c30fe8bdc562c12d38e56b2f))
- **core:** :sparkles: store `target` in the cache based on server response ([f321926](https://github.com/barbajs/barba/commit/f3219262bd161075d7478be39b60c4a5d3ae59b2))
- **core:** :sparkles: store response url through `IResponse` interface ([1963609](https://github.com/barbajs/barba/commit/19636096af3128d9ebbf73e7d845a593f13000e2))
- **core:** :sparkles: update cache `status` to reflect Promise state ([54edab1](https://github.com/barbajs/barba/commit/54edab19834f9e65024f18651c0634ca32f08e0b))
- **core:** ♻️ add headers type definitions ([5d2f13f](https://github.com/barbajs/barba/commit/5d2f13f098aed2a407dd664a66300c49c62362c2))
- **core:** ♻️ import `Headers` module ([1b6c418](https://github.com/barbajs/barba/commit/1b6c4181030c1e956fa43708f166f57315d6788d))
- **core:** ♻️ pass headers to the `request` utility ([60fa820](https://github.com/barbajs/barba/commit/60fa8204ca75c3a925c36d7e8f2c44a550b9c075))
- **core:** ✨ set custom request headers ([0edbffe](https://github.com/barbajs/barba/commit/0edbffea5d540ed35f1f85094d758c280a6e4d8d))

## [2.9.7](https://github.com/barbajs/barba/compare/@barba/core@2.9.6...@barba/core@2.9.7) (2020-01-16)

### Bug Fixes

- **core:** :bug: fix once only transition resolved for page ([0e52e61](https://github.com/barbajs/barba/commit/0e52e616e9964ad98f28239b1341a71cf1d29f4a)), closes [#483](https://github.com/barbajs/barba/issues/483)

## [2.9.6](https://github.com/barbajs/barba/compare/@barba/core@2.9.5...@barba/core@2.9.6) (2019-12-12)

### Bug Fixes

- **core:** :bug: fix route (object) resolution ([1fb344f](https://github.com/barbajs/barba/commit/1fb344f9f07fbe58c5893b09f59d471704c0c521))

## [2.9.5](https://github.com/barbajs/barba/compare/@barba/core@2.9.4...@barba/core@2.9.5) (2019-12-09)

### Bug Fixes

- **core:** :bug: filter transition errors from request errors ([281c85f](https://github.com/barbajs/barba/commit/281c85fc7bbaf3d51ee58653468c48b2404152ea)), closes [#475](https://github.com/barbajs/barba/issues/475)

## [2.9.4](https://github.com/barbajs/barba/compare/@barba/core@2.9.3...@barba/core@2.9.4) (2019-12-09)

### Bug Fixes

- **core:** :bug: fix cache management with ignore option ([d801813](https://github.com/barbajs/barba/commit/d801813976a130d41b3261e7de8f0bcdf5dcd581)), closes [#470](https://github.com/barbajs/barba/issues/470)

## [2.9.3](https://github.com/barbajs/barba/compare/@barba/core@2.9.2...@barba/core@2.9.3) (2019-12-09)

### Bug Fixes

- **core:** :recycle: refactor history states ([08c83b8](https://github.com/barbajs/barba/commit/08c83b857d8ab3f7826631968afaabf76e1a2e87)), closes [#473](https://github.com/barbajs/barba/issues/473) [#472](https://github.com/barbajs/barba/issues/472)

## [2.9.2](https://github.com/barbajs/barba/compare/@barba/core@2.9.1...@barba/core@2.9.2) (2019-11-25)

### Bug Fixes

- **root:** :art: improve typings for TS ([48f0637](https://github.com/barbajs/barba/commit/48f0637))

## [2.9.1](https://github.com/barbajs/barba/compare/@barba/core@2.9.0...@barba/core@2.9.1) (2019-11-25)

### Bug Fixes

- **core:** :rotating_light: fix TS errors, improve TS defs ([a48acd2](https://github.com/barbajs/barba/commit/a48acd2)), closes [#468](https://github.com/barbajs/barba/issues/468)

# [2.9.0](https://github.com/barbajs/barba/compare/@barba/core@2.8.0...@barba/core@2.9.0) (2019-11-25)

### Bug Fixes

- **core:** :bug: hooks: context can not be undefined ([f6bb536](https://github.com/barbajs/barba/commit/f6bb536)), closes [#468](https://github.com/barbajs/barba/issues/468)

### Features

- **core:** :sparkles: add replace history via data-attribute ([272a43f](https://github.com/barbajs/barba/commit/272a43f)), closes [#460](https://github.com/barbajs/barba/issues/460)

# [2.8.0](https://github.com/barbajs/barba/compare/@barba/core@2.7.2...@barba/core@2.8.0) (2019-11-06)

### Bug Fixes

- **core:** :bug: compare ports for sameUrl prevent check ([e2a84e4](https://github.com/barbajs/barba/commit/e2a84e4)), closes [#463](https://github.com/barbajs/barba/issues/463)
- **core:** :bug: popstate with unknown state (null) ([3369633](https://github.com/barbajs/barba/commit/3369633)), closes [#456](https://github.com/barbajs/barba/issues/456) [#466](https://github.com/barbajs/barba/issues/466)
- **core:** :ok_hand: resolve once transitions ([20cafe1](https://github.com/barbajs/barba/commit/20cafe1)), closes [#439](https://github.com/barbajs/barba/issues/439)

### Features

- **core:** :loud_sound: add/improve error logs ([e67a17b](https://github.com/barbajs/barba/commit/e67a17b)), closes [#447](https://github.com/barbajs/barba/issues/447)

## [2.7.2](https://github.com/barbajs/barba/compare/@barba/core@2.7.1...@barba/core@2.7.2) (2019-11-05)

### Bug Fixes

- **core:** :heavy_minus_sign: remove 'path' for URL resolution ([3875d0c](https://github.com/barbajs/barba/commit/3875d0c)), closes [#465](https://github.com/barbajs/barba/issues/465)
- **root:** :bug: fix context for views and add to transitions ([9054673](https://github.com/barbajs/barba/commit/9054673)), closes [#467](https://github.com/barbajs/barba/issues/467)

## [2.7.1](https://github.com/barbajs/barba/compare/@barba/core@2.7.0...@barba/core@2.7.1) (2019-10-27)

**Note:** Version bump only for package @barba/core

# [2.7.0](https://github.com/barbajs/barba/compare/@barba/core@2.6.1...@barba/core@2.7.0) (2019-10-27)

### Bug Fixes

- **core:** :bug: fix container + dom sibling insertion ([7f349a7](https://github.com/barbajs/barba/commit/7f349a7)), closes [#449](https://github.com/barbajs/barba/issues/449)
- **core:** :ok_hand: move after hooks ([42742ea](https://github.com/barbajs/barba/commit/42742ea)), closes [#455](https://github.com/barbajs/barba/issues/455)

### Features

- **core:** :sparkles: add preventRunning option ([93f0b50](https://github.com/barbajs/barba/commit/93f0b50)), closes [#414](https://github.com/barbajs/barba/issues/414)

## [2.6.1](https://github.com/barbajs/barba/compare/@barba/core@2.6.0...@barba/core@2.6.1) (2019-10-22)

### Bug Fixes

- **core:** :ambulance: fix URL with query/hash ([f5e639c](https://github.com/barbajs/barba/commit/f5e639c)), closes [#445](https://github.com/barbajs/barba/issues/445)
- **core:** :recycle: improve url/href/path management ([159afdc](https://github.com/barbajs/barba/commit/159afdc))

# [2.6.0](https://github.com/barbajs/barba/compare/@barba/core@2.5.1...@barba/core@2.6.0) (2019-08-22)

### Features

- **core:** :alembic: store scroll position in history ([0fb28e2](https://github.com/barbajs/barba/commit/0fb28e2))

## [2.5.1](https://github.com/barbajs/barba/compare/@barba/core@2.5.0...@barba/core@2.5.1) (2019-08-22)

### Bug Fixes

- **core:** :bug: keep container position ([5482154](https://github.com/barbajs/barba/commit/5482154))

# [2.5.0](https://github.com/barbajs/barba/compare/@barba/core@2.4.0...@barba/core@2.5.0) (2019-08-22)

### Features

- **core:** :ok_hand: replace popstate with back/forward ([c665052](https://github.com/barbajs/barba/commit/c665052))

# [2.4.0](https://github.com/barbajs/barba/compare/@barba/core@2.3.16...@barba/core@2.4.0) (2019-08-02)

### Features

- **core:** :sparkles: add history size ([3b8d7fd](https://github.com/barbajs/barba/commit/3b8d7fd))

## [2.3.16](https://github.com/barbajs/barba/compare/@barba/core@2.3.15...@barba/core@2.3.16) (2019-08-01)

### Bug Fixes

- **core:** :bug: Fix global hooks (before|afterEnter) on first load ([e948166](https://github.com/barbajs/barba/commit/e948166)), closes [#393](https://github.com/barbajs/barba/issues/393)

## [2.3.15](https://github.com/barbajs/barba/compare/@barba/core@2.3.14...@barba/core@2.3.15) (2019-07-17)

### Bug Fixes

- **core:** :ok_hand: view hook on page load ([c631b54](https://github.com/barbajs/barba/commit/c631b54)), closes [#393](https://github.com/barbajs/barba/issues/393)

## [2.3.14](https://github.com/barbajs/barba/compare/@barba/core@2.3.13...@barba/core@2.3.14) (2019-07-16)

### Bug Fixes

- **root:** :mute: remove print version ([be5aa73](https://github.com/barbajs/barba/commit/be5aa73)), closes [#415](https://github.com/barbajs/barba/issues/415)

## [2.3.13](https://github.com/barbajs/barba/compare/@barba/core@2.3.12...@barba/core@2.3.13) (2019-07-16)

### Bug Fixes

- **core:** :bug: Clean url extend ([7667a8d](https://github.com/barbajs/barba/commit/7667a8d))
- **core:** :bug: fix link with no href attribute ([e434ecb](https://github.com/barbajs/barba/commit/e434ecb))

## [2.3.12](https://github.com/barbajs/barba/compare/@barba/core@2.3.11...@barba/core@2.3.12) (2019-06-26)

### Bug Fixes

- **core:** :ok_hand: improve support of SVG links ([19e7e5d](https://github.com/barbajs/barba/commit/19e7e5d))

## [2.3.11](https://github.com/barbajs/barba/compare/@barba/core@2.3.10...@barba/core@2.3.11) (2019-06-25)

### Bug Fixes

- **core:** :bug: make page hook async ([10e66d9](https://github.com/barbajs/barba/commit/10e66d9))

## [2.3.10](https://github.com/barbajs/barba/compare/@barba/core@2.3.9...@barba/core@2.3.10) (2019-06-11)

### Bug Fixes

- **core:** :bug: remove "force repaint" when new container is added ([5a34322](https://github.com/barbajs/barba/commit/5a34322))
- **core:** :construction: fix "glitch" when new container added ([1286bf9](https://github.com/barbajs/barba/commit/1286bf9))

## [2.3.9](https://github.com/barbajs/barba/compare/@barba/core@2.3.8...@barba/core@2.3.9) (2019-04-29)

**Note:** Version bump only for package @barba/core

## [2.3.8](https://github.com/barbajs/barba/compare/@barba/core@2.3.7...@barba/core@2.3.8) (2019-04-29)

### Bug Fixes

- **core:** :bug: fix sameUrl with query params ([fa79a6a](https://github.com/barbajs/barba/commit/fa79a6a)), closes [#389](https://github.com/barbajs/barba/issues/389)

## [2.3.7](https://github.com/barbajs/barba/compare/@barba/core@2.3.6...@barba/core@2.3.7) (2019-04-29)

### Bug Fixes

- **core:** :bug: fix glitch on containers add/remove ([374660c](https://github.com/barbajs/barba/commit/374660c))

## [2.3.6](https://github.com/barbajs/barba/compare/@barba/core@2.3.5...@barba/core@2.3.6) (2019-04-29)

**Note:** Version bump only for package @barba/core

## [2.3.5](https://github.com/barbajs/barba/compare/@barba/core@2.3.4...@barba/core@2.3.5) (2019-04-29)

### Bug Fixes

- **core:** :construction: fix history ([36d3393](https://github.com/barbajs/barba/commit/36d3393))

## [2.3.4](https://github.com/barbajs/barba/compare/@barba/core@2.3.3...@barba/core@2.3.4) (2019-04-29)

### Bug Fixes

- **core:** :bug: fix object rule with no value ([4014fd8](https://github.com/barbajs/barba/commit/4014fd8))

## [2.3.3](https://github.com/barbajs/barba/compare/@barba/core@2.3.2...@barba/core@2.3.3) (2019-04-23)

### Bug Fixes

- **core:** :bug: update title with "next" ([f8c1940](https://github.com/barbajs/barba/commit/f8c1940)), closes [#384](https://github.com/barbajs/barba/issues/384)

## [2.3.2](https://github.com/barbajs/barba/compare/@barba/core@2.3.1...@barba/core@2.3.2) (2019-04-20)

### Bug Fixes

- **core:** :bug: remove current container at the end ([f6fab91](https://github.com/barbajs/barba/commit/f6fab91))

## [2.3.1](https://github.com/barbajs/barba/compare/@barba/core@2.3.0...@barba/core@2.3.1) (2019-04-16)

### Bug Fixes

- **core:** :bug: do not cache rendered HTML ([0cc4b86](https://github.com/barbajs/barba/commit/0cc4b86)), closes [#383](https://github.com/barbajs/barba/issues/383)

# [2.3.0](https://github.com/barbajs/barba/compare/@barba/core@2.2.0...@barba/core@2.3.0) (2019-04-14)

### Features

- **core:** :sparkles: add programmatically prefetch ([7b95ffd](https://github.com/barbajs/barba/commit/7b95ffd))

# [2.2.0](https://github.com/barbajs/barba/compare/@barba/core@2.1.3...@barba/core@2.2.0) (2019-04-14)

### Features

- **core:** :art: allow global hooks to be asynchronous ([be5dccf](https://github.com/barbajs/barba/commit/be5dccf))

## [2.1.3](https://github.com/barbajs/barba/compare/@barba/core@2.1.2...@barba/core@2.1.3) (2019-04-13)

### Bug Fixes

- **core:** :loud_sound: print version ([24dd2ea](https://github.com/barbajs/barba/commit/24dd2ea))

### Reverts

- **root:** :bug: revert failed release ([2b8a1ef](https://github.com/barbajs/barba/commit/2b8a1ef))

## [2.1.3](https://github.com/barbajs/barba/compare/@barba/core@2.1.2...@barba/core@2.1.3) (2019-04-13)

### Bug Fixes

- **core:** :loud_sound: print version ([24dd2ea](https://github.com/barbajs/barba/commit/24dd2ea))

## [2.1.2](https://github.com/barbajs/barba/compare/@barba/core@2.1.1...@barba/core@2.1.2) (2019-04-13)

### Bug Fixes

- **core:** :mute: remove debug logs ([f4ce952](https://github.com/barbajs/barba/commit/f4ce952))

## [2.1.1](https://github.com/barbajs/barba/compare/@barba/core@2.1.0...@barba/core@2.1.1) (2019-04-13)

### Bug Fixes

- **core:** :bug: fix cache not working ([a01e122](https://github.com/barbajs/barba/commit/a01e122))
- **core:** :bug: fix hook order ([716b062](https://github.com/barbajs/barba/commit/716b062))
- **core:** :bug: fix hooks order in sync mode true ([b3c92d1](https://github.com/barbajs/barba/commit/b3c92d1))
- **core:** :bug: fix popstate navigation ([f78ee11](https://github.com/barbajs/barba/commit/f78ee11)), closes [#359](https://github.com/barbajs/barba/issues/359)
- **core:** :bug: fix sameUrl + anchors ([039f5d9](https://github.com/barbajs/barba/commit/039f5d9)), closes [#359](https://github.com/barbajs/barba/issues/359)
- **core:** :bug: fix timeout error ([70b7805](https://github.com/barbajs/barba/commit/70b7805)), closes [#373](https://github.com/barbajs/barba/issues/373)
- **core:** :bug: fix view.beforeEnter on barba ready ([5a09470](https://github.com/barbajs/barba/commit/5a09470)), closes [#360](https://github.com/barbajs/barba/issues/360)
- **core:** :bug: fix wrong combo namespace / view hooks ([3c775a3](https://github.com/barbajs/barba/commit/3c775a3)), closes [#351](https://github.com/barbajs/barba/issues/351)
- **core:** :checkered_flag: fix InvalidStateError on IE ([b9eece9](https://github.com/barbajs/barba/commit/b9eece9)), closes [#371](https://github.com/barbajs/barba/issues/371)
- **core:** :green_apple: fix img[srcset] parsing ([8afe945](https://github.com/barbajs/barba/commit/8afe945)), closes [#362](https://github.com/barbajs/barba/issues/362)
- **core:** :ok_hand: add Accept header ([94962ef](https://github.com/barbajs/barba/commit/94962ef))
- **core:** :ok_hand: fix `beforeEnter` view hook ([0d11e44](https://github.com/barbajs/barba/commit/0d11e44))
- **core:** :ok_hand: make main transition hooks public ([2c0cc28](https://github.com/barbajs/barba/commit/2c0cc28))
- **core:** :ok_hand: make onRequestError public ([61193ad](https://github.com/barbajs/barba/commit/61193ad))

# 2.1.0 (2019-03-17)

### Bug Fixes

- **core:** :bug: append next container correctly on sync mode ([dc62bd3](https://github.com/barbajs/barba/commit/dc62bd3)), closes [#4](https://github.com/barbajs/barba/issues/4)
- **core:** :bug: fix `xlink:href` with SVG ([19ecd81](https://github.com/barbajs/barba/commit/19ecd81)), closes [#1](https://github.com/barbajs/barba/issues/1)
- **css:** :bug: fix css with next tick ([63642bf](https://github.com/barbajs/barba/commit/63642bf))
- **prefetch:** :bug: fix requestError ([33c213b](https://github.com/barbajs/barba/commit/33c213b))
- **root:** :bug: force publish ([ddb8798](https://github.com/barbajs/barba/commit/ddb8798))
- **root:** :ok_hand: replace error with warning when no transition ([661801e](https://github.com/barbajs/barba/commit/661801e))
- :bug: fix case issues ([c6adcb3](https://github.com/barbajs/barba/commit/c6adcb3))

### Features

- **core:** :sparkles: add prevent custom + update README ([2fb4ec6](https://github.com/barbajs/barba/commit/2fb4ec6))
- **css:** :recycle: add transitionend logic + big refactoring ([b775358](https://github.com/barbajs/barba/commit/b775358))
- **css:** :tada: initial commit ([aed8206](https://github.com/barbajs/barba/commit/aed8206))
- **root:** :sparkles: add logger + fixes ([6db3875](https://github.com/barbajs/barba/commit/6db3875))
- **router:** :sparkles: add multiple properties to `route` ([4e92c83](https://github.com/barbajs/barba/commit/4e92c83))
