# Notes

## Prerelease `publish`

```sh
npm run build
lerna publish --canary --preid next --dist-tag next
lerna publish --preid next # only with --canary ? https://github.com/lerna/lerna/tree/master/commands/publish#--preid
lerna publish --dist-tag next
lerna publish --github-release --force-publish=*
lerna publish --github-release
```

## Test `publish` with [verdaccio](https://www.npmjs.com/package/verdaccio)

```sh
npm adduser --registry http://localhost:4873
lerna publish --registry http://localhost:4873 --canary --preid next
```

---

> Questions…
>
> - [x] leave vs enter
>   - ✅ leave current, enter next
>   - ⛔️ enter transition === first step, leave transition === last step
> - [x] canceled vs progress (probably both)
>   - [x] À AJOUTER + force
> - more global events?
> - scroll/lock util?
> - build module/nomodule? BOFFFFFF
> - Support
> - unpkg
> - release `-alpha` + "hard reset" move to github?
>   - next…
> - [ ] views
>   - [x] core ✅ / beforeEnter, beforeLeave, afterEnter, afterLeave
>   - [ ] doit fonctionner avec IE <= 11 ???

---

## Showcase

- https://leap-in.com/
