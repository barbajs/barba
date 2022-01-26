# Todos

- [x][m] Router : allow leading slash ?
- [x][m] Reload current page
- [x][m] Prevent `xlink:href` on link enter (eg: SVG)
- [x][s] No transitions ? weird behavior…
- [ ][w] BS, how to fix it (definitely)
- [ ][m] (npm)ignore .DS_Store files

---

- [ ] @barba/
  - [ ] **transitions** (basic, ready-to-use. e.g.: fade, slide, …)
  - [ ] **css** (add CSS classes via hooks)
  - [ ] **loader** ??? (programatically fetch and cache pages - also see [quicklink](https://github.com/GoogleChromeLabs/quicklink))
- [ ] Tests:
  - [ ] unit tests
  - [ ] e2e tests (puppetteer? / cypress?)
- [ ] Documentation
  - [ ] Manual (instructions, examples, …)
  - [ ] Auto generated from code
- [ ] Builds / releases
  - [ ] auto-update version(s)
  - [ ] auto-update changelogs
  - [ ] auto-update file gzip size (website and readme)
  - [ ] CI (tests, coverage on push, PR, …)
  - [ ] Force git commit to follow a certain schema
- [ ] License (find correct open source license)
  - > Luigi said: anyone can do what they want, but:
    >
    > - they can't resell it as it is
    > - I have the right in any moment to not allow a specific use
  - NB: This seems conflicting with open source core principles
    Following are the most "restrictive" :)
    - [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)
    - [Open Software License 3.0](https://choosealicense.com/licenses/osl-3.0/)
    - [European Union Public License 1.2](https://choosealicense.com/licenses/eupl-1.2/)
- [ ] Community
  - [x] Github issue template
  - [x] Forum / chat -> [Slack](https://barbajs.slack.com)
- [ ] Other
  - [ ] Make jest work with `babel.config.js` (global + optional local merge)
    - https://github.com/babel/babel/issues/7208
    - https://github.com/facebook/jest/issues/6053#issuecomment-383632515
    - https://babeljs.io/docs/en/options
    - https://babeljs.io/docs/en/config-files
    - ```
          @barba/core:     import barba from '../src';
          @barba/core:            ^^^^^
          @barba/core:     SyntaxError: Unexpected identifier
          @barba/core:       at ScriptTransformer._transformAndBuildScript (../../node_modules/jest-runtime/build/script_transformer.js:403:17)
          @barba/core: babel.config.js:root
          @barba/core: .babelrc.js:core
      ```
  - [ ] Repo transfer?
    - [doc](https://help.github.com/articles/transferring-a-repository/)
    - [hack post](https://francisco.io/blog/transferring-github-stars/)
  - VSCode extensions recommendations? settings?
