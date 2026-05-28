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
  names: NameOrNames,
  cwd?: OptionalUrlOrPath,
  allowSymlinks?: boolean,
  filter: Filter,
}} FindOptions

@typedef {Promise<string | void>} FindResult
*/

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

@param {FindOptions} options
@returns {FindResult}
*/
async function find({names: nameOrNames, cwd, allowSymlinks = true, filter}) {
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

export {find}
