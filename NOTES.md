# Notes

## Lerna/npm publish

- `yarn run release`
- `yarn run release:next`

### Beta `publish`

```sh
yarn test
lerna publish --canary --preid next --dist-tag next
lerna publish --github-release --force-publish=*
lerna publish --github-release
```

To be tested: `--github-release`

### Test `publish` with [verdaccio](https://www.npmjs.com/package/verdaccio)

```sh
npm adduser --registry http://localhost:4873
lerna publish --registry http://localhost:4873 --canary --preid next
```
