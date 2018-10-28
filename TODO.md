# Todos

- Find correct open source license
  - anyone can do what they want, but:
    - they can't resell it as it is
    - I have the right in any moment to not allow a specific use
- Implement unit tests + e2e tests (puppetteer? / cypress?)
- Documentation automatic or manual?
- When build for production (+ npm push), update the file gzip in website and readme
  - use conventional commits/changelog with some automation
- Make jest work with `babel.config.js` (global + optional local merge)
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
