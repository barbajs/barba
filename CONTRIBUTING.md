# Contributing

This project uses:

- [Lerna scopes](https://lernajs.io/)
- [Commitizen](http://commitizen.github.io/cz-cli/)
- [EditorConfig](https://editorconfig.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [markdownlint](https://github.com/DavidAnson/markdownlint)

> Please, be sure to properly configure your editor…

## Install

- `git clone git@github.com:barbajs/barba-next.git`
- `cd barba-next`
- `yarn install`
- `lerna bootstrap`

## Testing

Run `yarn test` or `npm test`.

For watching mode, run `yarn run watch` or `npm run watch`.

> Do not pay attention to the few `console.error` logs…<br>
> In watch mode, you can select a specific package by pressing `l` > :arrow_down: > `space` > :leftwards_arrow_with_hook:

## Comitting

Run `npm run commit` or install `commitizen` globally and run `cz`.

This project follows:

- [Conventional Commits](https://conventionalcommits.org) specification for commit "structure"
- [gitmoji](https://gitmoji.carloscuesta.me/) for commit messages
