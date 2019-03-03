# CI

## @snitch

```
language: node_js
node_js:
  - "8"
after_success: 'npm run coverage'
```

## sassy-beam

`.travis.yml`

```yml
language: node_js
cache:
  directories:
    - ~/.npm
notifications:
  email: false
node_js:
  - '10'
  - '9'
  - '8'
after_success:
  - npm run travis-deploy-once "npm run semantic-release"
branches:
  except:
    - /^v\d+\.\d+\.\d+$/
```

`package.json`

```json
"release": {
  "prepare": [
    "@semantic-release/npm",
    {
      "path": "@semantic-release/exec",
      "cmd": "npm run doc"
    },
    {
      "path": "@semantic-release/git",
      "assets": [
        "docs"
      ],
      "message": "docs(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }
  ]
},
```

## [Lerna FAQ](https://github.com/lerna/lerna/blob/master/FAQ.md)

`circle.yml`

```yml
dependencies:
  post:
    - npm run bootstrap
```
