import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import {toAbsolutePath} from 'url-or-path'

/**
@import {OptionalUrlOrPath} from 'url-or-path'
@import {Stats} from 'node:fs'

@typedef {{
  name: string,
  path: string,
  stat: () => ReturnType<typeof safeStat>,
}} FileOrDirectory

@typedef {(fileOrDirectory: FileOrDirectory) => Promise<boolean> | boolean} Filter

@typedef {string | string[]} NameOrNames

@typedef {{
  cwd?: OptionalUrlOrPath,
  allowSymlinks?: boolean,
  filter: Filter,
}} FindOptions

@typedef {Promise<string | void>} FindResult

@typedef {(fileOrDirectory: Omit<FileOrDirectory, 'stat'> & {stats: Stats}) => Promise<boolean> | boolean} FileOrDirectoryFilter
@typedef {Omit<FindOptions, 'filter'> & {filter?: FileOrDirectoryFilter}} FileOrDirectoryFindOptions

*/

/**
@param {string} name
@param {string} path
@param {boolean} allowSymlinks
@returns {FileOrDirectory}
*/
function createFileOrDirectory(name, path, allowSymlinks) {
  /** @type {ReturnType<safeStat> | undefined} */
  let promise
  const stat = () => {
    promise ??= safeStat(path, allowSymlinks)
    return promise
  }
  return {name, path, stat}
}

/**
Find matched name or names in a directory

@param {NameOrNames} nameOrNames
@param {FindOptions} options
@returns {FindResult}
*/
async function findInDirectoryInternal(
  nameOrNames,
  {cwd, allowSymlinks = true, filter},
) {
  const directory = toAbsolutePath(cwd) ?? process.cwd()
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  for (const name of names) {
    const fileOrDirectory = path.join(directory, name)
    const file = createFileOrDirectory(name, fileOrDirectory, allowSymlinks)

    if (await filter(file)) {
      return fileOrDirectory
    }
  }
}

/**
Get stats for the given `path`.

@param {string} path
@param {boolean} [allowSymlinks]
@returns {Promise<Stats | undefined>}
*/
async function safeStat(path, allowSymlinks = true) {
  try {
    return await (allowSymlinks ? fs.stat : fs.lstat)(path)
  } catch {
    // No op
  }
}

/**
@param {(stats: Stats) => boolean} typeCheck
@param {FileOrDirectoryFindOptions} options
@returns {FindOptions}
*/
const createFindOptions = (typeCheck, {filter, ...options} = {}) => ({
  ...options,
  async filter(file) {
    const stats = await file.stat()
    return Boolean(
      stats &&
      typeCheck(stats) &&
      (!filter || (await filter({name: file.name, path: file.path, stats}))),
    )
  },
})

/**
Find matched file or file names in a directory.

@param {NameOrNames} nameOrNames
@param {FileOrDirectoryFindOptions} [options]
@returns {FindResult}

@example
```js
import {findFile} from 'find-in-directory'

console.log(await findFile(['foo.config.js', 'foo.config.json']))
// "/path/to/foo.config.json"
```
*/
function findFile(nameOrNames, options) {
  return findInDirectoryInternal(
    nameOrNames,
    createFindOptions((stats) => stats.isFile(), options),
  )
}

/**
Find matched directory or directory names in a directory.

@param {NameOrNames} nameOrNames
@param {FileOrDirectoryFindOptions} [options]
@returns {FindResult}

@example
```js
import {findDirectory} from 'find-in-directory'

console.log(await findDirectory(['node_modules', '.yarn']))
// "/path/to/node_modules"
```
*/
function findDirectory(nameOrNames, options) {
  return findInDirectoryInternal(
    nameOrNames,
    createFindOptions((stats) => stats.isDirectory(), options),
  )
}

/**
Find matched directory or file names in a directory.

@param {NameOrNames} nameOrNames
@param {FileOrDirectoryFilter} filter
@param {Omit<FileOrDirectoryFindOptions, 'filter'>} [options]
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
function findInDirectory(nameOrNames, filter, options) {
  return findInDirectoryInternal(
    nameOrNames,
    createFindOptions(() => true, {...options, filter}),
  )
}

export {findDirectory, findFile, findInDirectory}
