# Packaging

## To package app for the local platform:

```bash
yarn package
```

## To package apps for MacOS

On Mac, you can also do:

```bash
npm run package:mac
```

## To package apps for both Linux + Windows from a Linux machine

This is how you easily package for Win/Linux from Linux:

1. Run docker container & create releases

   docker run --rm -ti \
    --env-file <(env | grep -iE 'DEBUG|NODE*|ELECTRON*|YARN*|NPM*|CI|CIRCLE|TRAVIS*TAG|TRAVIS|TRAVIS_REPO*|TRAVIS*BUILD*|TRAVIS*BRANCH|TRAVIS_PULL_REQUEST*|APPVEYOR*|CSC*|GH*|GITHUB*|BT*|AWS*|STRIP|BUILD\_') \
    --env ELECTRON_CACHE="/root/.cache/electron" \
    --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
    -v ${PWD}:/project \
-v${PWD##\*/}-node-modules:/project/node_modules \
    -v ~/.cache/electron:/root/.cache/electron \
    -v ~/.cache/electron-builder:/root/.cache/electron-builder \
    electronuserland/builder:wine /bin/bash -c "yarn && ./node_modules/.bin/electron-builder -mwl"

2. Done. Check your `release` directory.

Source: https://www.electron.build/multi-platform-build

## To package apps for all platforms:

First, refer to [Multi Platform Build](https://www.electron.build/multi-platform-build) for dependencies.

Then,

```bash
$ yarn package-all
```

To package apps with options:

```bash
$ yarn package -- --[option]
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:

```bash
DEBUG_PROD=true yarn package
```
