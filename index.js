import {find} from './find.js'

/**
@import {Stats} from 'node:fs'
@import {NameOrNames, FileOrDirectory, FindOptions, FindResult} from './find.js'

@typedef {(fileOrDirectory: Omit<FileOrDirectory, 'stat'> & {stats: Stats}) => Promise<boolean> | boolean} FileOrDirectoryFilter

@typedef {Omit<FindOptions, 'names' | 'filter'> & {filter?: FileOrDirectoryFilter}} FileOrDirectoryFindOptions

@typedef {FileOrDirectoryFilter | FileOrDirectoryFindOptions} FilterOrOptions

@typedef {Omit<FileOrDirectoryFindOptions, 'filter'>} OptionsWithoutFilter
*/

/**
@param {NameOrNames} nameOrNames
@param {(stats: Stats) => boolean} typeCheck
@param {FilterOrOptions} [filterOrOptions]
@param {OptionsWithoutFilter} [optionsWithoutFilter]
*/
function findInDirectoryInternal(
  nameOrNames,
  typeCheck,
  filterOrOptions,
  optionsWithoutFilter,
) {
  const {filter, ...options} =
    typeof filterOrOptions === 'function'
      ? {...optionsWithoutFilter, filter: filterOrOptions}
      : {...filterOrOptions}

  return find({
    ...options,
    names: nameOrNames,
    async filter(file) {
      const stats = await file.stat()
      return Boolean(
        stats &&
        typeCheck(stats) &&
        (!filter || (await filter({name: file.name, path: file.path, stats}))),
      )
    },
  })
}

/**
Find matched file or file names in a directory.

@param {NameOrNames} nameOrNames
@param {FilterOrOptions} [filterOrOptions]
@param {OptionsWithoutFilter} [optionsWithoutFilter]
@returns {FindResult}

@example
```js
import {findFile} from 'find-in-directory'

console.log(await findFile(['foo.config.js', 'foo.config.json']))
// "/path/to/foo.config.json"
```
*/
function findFile(nameOrNames, filterOrOptions, optionsWithoutFilter) {
  return findInDirectoryInternal(
    nameOrNames,
    (stats) => stats.isFile(),
    filterOrOptions,
    optionsWithoutFilter,
  )
}

/**
Find matched directory or directory names in a directory.

@param {NameOrNames} nameOrNames
@param {FilterOrOptions} [filterOrOptions]
@param {OptionsWithoutFilter} [optionsWithoutFilter]
@returns {FindResult}

@example
```js
import {findDirectory} from 'find-in-directory'

console.log(await findDirectory(['node_modules', '.yarn']))
// "/path/to/node_modules"
```
*/
function findDirectory(nameOrNames, filterOrOptions, optionsWithoutFilter) {
  return findInDirectoryInternal(
    nameOrNames,
    (stats) => stats.isDirectory(),
    filterOrOptions,
    optionsWithoutFilter,
  )
}

/**
Find matched directory or file names in a directory.

@param {NameOrNames} nameOrNames
@param {FilterOrOptions} [filterOrOptions]
@param {OptionsWithoutFilter} [optionsWithoutFilter]
@returns {FindResult}

@example
```js
import {findInDirectory} from 'find-in-directory'

console.log(
  await findInDirectory(
    ['node_modules', 'yarn.lock'],
    ({ stats }) =>
      (stats.name === 'node_modules' && stats.isDirectory()) ||
      (stats.name === 'yarn.lock' && stats.isFile()),
  ),
);
// "/path/to/node_modules"
```
*/
function findInDirectory(nameOrNames, filterOrOptions, optionsWithoutFilter) {
  return findInDirectoryInternal(
    nameOrNames,
    () => true,
    filterOrOptions,
    optionsWithoutFilter,
  )
}

export {findDirectory, findFile, findInDirectory}
