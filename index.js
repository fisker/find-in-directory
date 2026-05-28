import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import {toAbsolutePath} from 'url-or-path'

/**
@import {OptionalUrlOrPath} from 'url-or-path'
@import {Stats} from 'node:fs'

@typedef {(fileOrDirectory: FileOrDirectory) => Promise<boolean> | boolean} Filter

@typedef {{
  name: string,
  path: string,
  stats: Stats,
}} FileOrDirectory

@typedef {string | string[]} NameOrNames

@typedef {{
  cwd?: OptionalUrlOrPath,
  allowSymlinks?: boolean,
  filter?: Filter
}} FindOptions

@typedef {Filter | FindOptions} FilterOrOptions

@typedef {Omit<FindOptions, 'filter'>} OptionsWithoutFilter

@typedef {Promise<string | undefined>} FindResult
*/

/** @param {FileOrDirectory} file */
const isFile = (file) => file.stats.isFile()
/** @param {FileOrDirectory} file */
const isDirectory = (file) => file.stats.isDirectory()

/**
Get stats for the given `path`.

@param {string} path
@param {boolean} allowSymlinks
*/
async function safeStat(path, allowSymlinks) {
  try {
    return await (allowSymlinks ? fs.stat : fs.lstat)(path)
  } catch {
    // No op
  }
}

/**
Find matched name or names in a directory

@param {NameOrNames} nameOrNames
@param {FilterOrOptions | undefined} filterOrOptions
@param {OptionsWithoutFilter | undefined} optionsWithoutFilter
@param {typeof isFile | typeof isDirectory} [typeCheck]
*/
async function findInternal(
  nameOrNames,
  filterOrOptions,
  optionsWithoutFilter,
  typeCheck,
) {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
  const options =
    typeof filterOrOptions === 'function'
      ? {...optionsWithoutFilter, filter: filterOrOptions}
      : {...filterOrOptions}
  const directory = toAbsolutePath(options.cwd) ?? process.cwd()
  const allowSymlinks = options.allowSymlinks ?? true
  /** @param {FileOrDirectory} file */
  const filter = async (file) =>
    (!typeCheck || typeCheck(file)) &&
    (!options.filter || (await options.filter(file)))

  for (const name of names) {
    const fileOrDirectory = path.join(directory, name)
    const stats = await safeStat(fileOrDirectory, allowSymlinks)

    if (stats) {
      const file = {
        name,
        path: fileOrDirectory,
        stats,
      }

      if (await filter(file)) {
        return fileOrDirectory
      }
    }
  }
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
  return findInternal(
    nameOrNames,
    filterOrOptions,
    optionsWithoutFilter,
    isFile,
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
  return findInternal(
    nameOrNames,
    filterOrOptions,
    optionsWithoutFilter,
    isDirectory,
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
    ({ name, stats }) =>
      (name === 'node_modules' && stats.isDirectory()) ||
      (name === 'yarn.lock' && stats.isFile()),
  ),
);
// "/path/to/node_modules"
```
*/
function findInDirectory(nameOrNames, filterOrOptions, optionsWithoutFilter) {
  return findInternal(nameOrNames, filterOrOptions, optionsWithoutFilter)
}

export {findDirectory, findFile, findInDirectory}
