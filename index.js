import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import {toAbsolutePath} from 'url-or-path'

/**
@import {UrlOrPath} from 'url-or-path'

@typedef {
  (fileOrDirectory: {name: string, path: string}) => Promise<boolean>
} Predicate

@typedef {string | string[]} NameOrNames

@typedef {{ allowSymlinks?: boolean}} FindOptions
*/

/**
 * Find matched name or names in a directory
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} predicate
 * @returns {Promise<string | void>}
 */
async function findInDirectory(directory, nameOrNames, predicate) {
  directory = toAbsolutePath(directory)
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  for (const name of names) {
    const file = path.join(directory, name)

    // eslint-disable-next-line no-await-in-loop
    if (await predicate({name, path: file})) {
      return file
    }
  }
}

/** @type {(...predicates: Predicate[]) => Predicate} */
const combinePredicates =
  (...predicates) =>
  async (file) => {
    for (const predicate of predicates) {
      if (!predicate) {
        continue
      }

      // eslint-disable-next-line no-await-in-loop
      if ((await predicate(file)) === false) {
        return false
      }
    }

    return true
  }

/**
 * Check if given path is file or directory
 * @param {string} path
 * @param {'isFile' | 'isDirectory'} type
 * @param {FindOptions} [options]
 * @returns {Promise<boolean>}
 */
async function checkType(path, type, options) {
  const allowSymlinks = options?.allowSymlinks ?? true
  let stats
  try {
    stats = await (allowSymlinks ? fs.stat : fs.lstat)(path)
  } catch {
    return false
  }

  return stats[type]()
}

/**
 * Find matched file or file names in a directory.
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} [predicate]
 * @param {FindOptions} [options]
 * @returns {ReturnType<findInDirectory>}
 */
function findFile(directory, nameOrNames, predicate, options) {
  if (typeof predicate !== 'function' && !options) {
    options = predicate
    predicate = undefined
  }

  predicate = combinePredicates(
    (file) => checkType(file.path, 'isFile', options),
    predicate,
  )

  return findInDirectory(directory, nameOrNames, predicate)
}

/**
 * Find matched directory or directory names in a directory.
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} [predicate]
 * @param {FindOptions} [options]
 * @returns {ReturnType<findInDirectory>}
 */
function findDirectory(directory, nameOrNames, predicate, options) {
  if (typeof predicate !== 'function' && !options) {
    options = predicate
    predicate = undefined
  }

  predicate = combinePredicates(
    (file) => checkType(file.path, 'isDirectory', options),
    predicate,
  )

  return findInDirectory(directory, nameOrNames, predicate)
}

export {findDirectory, findFile}
