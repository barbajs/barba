# Notes

## Prerelease `publish`

```sh
lerna publish --canary --preid next
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
