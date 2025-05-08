# find-in-directory

[![Npm Version][package_version_badge]][package_link]
[![MIT License][license_badge]][license_link]
[![Coverage][coverage_badge]][coverage_link]

[coverage_badge]: https://img.shields.io/codecov/c/github/fisker/find-in-directory.svg?style=flat-square
[coverage_link]: https://app.codecov.io/gh/fisker/find-in-directory
[license_badge]: https://img.shields.io/npm/l/find-in-directory.svg?style=flat-square
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

console.log(await findFile(['foo.config.js', 'foo.config.json']))
// "/path/to/foo.config.json"

console.log(await findDirectory(['node_modules', '.yarn']))
// "/path/to/node_modules"
```

## API

### `{findFile, findDirectory}(nameOrNames, options?)`

#### `nameOrNames`

The file/directory name or names to find.

Type: `string[] | string`

#### `options.cwd`

The directory to find.

Type: `URL | string`\
Default: `process.cwd()`

#### `options.filter`

Type: `(fileOrDirectory: {name: string, path: string, stats: fs.Stats}) => Promise<boolean>`

```js
import fs from 'node:fs/promises'
import {findFile} from 'find-in-directory'

const file = await findFile(['foo.js', 'bar.js'], {
  async filter({path: file}) {
    const content = await fs.readFile(file, 'utf8')
    return content.startsWith('#!/usr/bin/env node')
  },
})
// "/path/to/bar.js"
```

#### `options.allowSymlinks`

Should allow symlinks or not.

Type: `boolean`

## Related

- [`search-closest`](https://github.com/fisker/search-closest) - Find closest file or directory.
