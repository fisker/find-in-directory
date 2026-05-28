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
import {
  findFileInDirectory,
  findDirectoryInDirectory,
  findInDirectory,
} from 'find-in-directory'

console.log(await findFileInDirectory(['foo.config.js', 'foo.config.json']))
// "/path/to/foo.config.json"

console.log(await findDirectoryInDirectory(['node_modules', '.yarn']))
// "/path/to/node_modules"

console.log(
  await findInDirectory([
    {name: 'yarn.lock', type: 'file'},
    {name: '.yarn', type: 'directory'},
  ]),
)
// "/path/to/yarn.lock"
```

## API

### Call signatures

- `find{File,Directory,}InDirectory(targetOrTargets: TargetOrTargets)`
- `find{File,Directory,}InDirectory(targetOrTargets: TargetOrTargets, options: Options)`
- `find{File,Directory,}InDirectory(targetOrTargets: TargetOrTargets, filter: Options["filter"])`
- `find{File,Directory,}InDirectory(targetOrTargets: TargetOrTargets, filter: Options["filter"], options: Omit<Options, "filter">)`

### types

#### `TargetOrTargets`

The files or directories to find.

Type: `Target | Target[]`

#### `Target`

The files or directories to find.

Type: `string | {name: string, type?: 'file' | 'directory', filter?: Options["filter"]}`

#### `Target["type"]`

The file or directory type looking for.

```js
import fs from 'node:fs/promises'
import {findInDirectory} from 'find-in-directory'

const result = await findInDirectory([
  {name: 'yarn.lock', type: 'file'},
  {name: '.yarn', type: 'directory'},
])
// "/path/to/bar.js"
```

_`Target.type` is ignored in `findFileInDirectory()` and `fileDirectoryInDirectory()`, only works in `findInDirectory()`_

#### `Target["name"]`

#### `Options["cwd"]`

The directory to find.

Type: `URL | string`\
Default: `process.cwd()`

#### `options["filter"]`

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

#### `options["allowSymlinks"]`

Should allow symlinks or not.

Type: `boolean`

#### `options["type"]`

The file or directory type looking for.

Type: `'file' | 'directory'`

_`options.type` is ignored in `findFileInDirectory()` and `fileDirectoryInDirectory()`, only works in `findInDirectory()`_

## Related

- [`search-closest`](https://github.com/fisker/search-closest) - Find closest file or directory.
