# Contributing

This project uses:

- [TypeScript](http://www.typescriptlang.org/)
- [Lerna](https://lerna.js.org/)
- [Commitizen](http://commitizen.github.io/cz-cli/)
- [EditorConfig](https://editorconfig.org/)
- [TSLint](https://palantir.github.io/tslint/)
- [Prettier](https://prettier.io/)
- [markdownlint](https://github.com/DavidAnson/markdownlint)

> Please, be sure to properly configure your editor…

## Install

Make sure you have `yarn` and `node >= 10.16.0`

- `git clone git@github.com:barbajs/barba.git`
- `cd barba`
- `yarn install`

## Testing

Run `yarn test`

For watching mode, run `yarn run watch`

> Do not pay attention to the few `console.error` logs…<br>
> In watch mode, you can select a specific package by pressing `l` > :arrow_down: > `space` > :leftwards_arrow_with_hook:

## Comitting

Run `yarn run commit` or install `commitizen` globally and run `cz`.

This project follows:

- [Conventional Commits](https://conventionalcommits.org) specification for commit "structure"
- [gitmoji](https://gitmoji.carloscuesta.me/) for commit messages
