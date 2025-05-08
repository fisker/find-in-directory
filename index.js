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
  stats: Stats,
}} FileOrDirectory

@typedef {(fileOrDirectory: FileOrDirectory) => Promise<boolean> | boolean} Filter

@typedef {string | string[]} NameOrNames

@typedef {{
  cwd?: OptionalUrlOrPath,
  allowSymlinks?: boolean,
  filter?: Filter,
}} FindOptions

@typedef {Promise<string | void>} FindResult
*/

/** @type {(stats: Stats | undefined) => boolean} */
const isFile = (stats) => stats?.isFile()
/** @type {(stats: Stats | undefined) => boolean} */
const isDirectory = (stats) => stats?.isDirectory()

/**
Find matched name or names in a directory

@param {NameOrNames} nameOrNames
@param {FindOptions & {
  typeCheck: typeof isFile | typeof isDirectory,
}} options
@returns {FindResult}
*/
async function findInDirectory(
  nameOrNames,
  {typeCheck, cwd, allowSymlinks = true, filter},
) {
  const directory = toAbsolutePath(cwd) ?? process.cwd()
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  for (const name of names) {
    const fileOrDirectory = path.join(directory, name)
    const stats = await safeStat(fileOrDirectory, allowSymlinks)

    if (
      (await typeCheck(stats)) &&
      (!filter || (await filter({name, path: fileOrDirectory, stats})))
    ) {
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
Find matched file or file names in a directory.

@param {NameOrNames} nameOrNames
@param {FindOptions} [options]
@returns {FindResult}

@example
```js
import {findFile} from 'find-in-directory'

console.log(await findFile(['foo.config.js', 'foo.config.json']))
// "/path/to/foo.config.json"
```
*/
function findFile(nameOrNames, options) {
  return findInDirectory(nameOrNames, {...options, typeCheck: isFile})
}

/**
Find matched directory or directory names in a directory.

@param {NameOrNames} nameOrNames
@param {FindOptions} [options]
@returns {FindResult}

@example
```js
import {findDirectory} from 'find-in-directory'

console.log(await findDirectory(['node_modules', '.yarn']))
// "/path/to/node_modules"
```
*/
function findDirectory(nameOrNames, options) {
  return findInDirectory(nameOrNames, {...options, typeCheck: isDirectory})
}

export {findDirectory, findFile}
