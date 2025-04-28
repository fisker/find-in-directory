# find-in-directory

[![Build Status][github_actions_badge]][github_actions_link]
[![Coverage][coveralls_badge]][coveralls_link]
[![Npm Version][package_version_badge]][package_link]
[![MIT License][license_badge]][license_link]

[github_actions_badge]: https://img.shields.io/github/actions/workflow/status/fisker/find-in-directory/continuous-integration.yml?barnach=main&style=flat-square
[github_actions_link]: https://github.com/fisker/find-in-directory/actions?query=branch%3Amain
[coveralls_badge]: https://img.shields.io/coveralls/github/fisker/find-in-directory/main?style=flat-square
[coveralls_link]: https://coveralls.io/github/fisker/find-in-directory?branch=main
[license_badge]: https://img.shields.io/npm/l/prettier-format.svg?style=flat-square
[license_link]: https://github.com/fisker/find-in-directory/blob/main/license
[package_version_badge]: https://img.shields.io/npm/v/find-in-directory.svg?style=flat-square
[package_link]: https://www.npmjs.com/package/find-in-directory

> Find file or directory by names in a directory.

## Install

```bash
yarn add find-in-directory
```

## Usage

```js
import {findFile, findDirectory} from 'find-in-directory'

const file = await findFile(process.cwd(), [
  'package.json',
  'package.json5',
  'package.yaml',
])

// "/path/to/package.json"
```

## API

### `{findFile, findDirectory}(directory, nameOrNames, predicate?, options?)`

#### `directory`

The directory to find.

Type: `URL | string`

#### `nameOrNames`

The file/directory name or names to find.

Type: `string[] | string`

#### `predicate`

Type: `(fileOrDirectory: {name: string, path: string}) => Promise<boolean>`

#### `options`

#### `options.allowSymlinks`

Should allow symlinks or not.

Type: `boolean`
