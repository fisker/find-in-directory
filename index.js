import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import {toPath} from 'url-or-path'

/** @typedef {import('url-or-path').UrlOrPath} UrlOrPath */
/** @typedef {(path: string) => Promise<boolean>} Predicate */
/** @typedef {string | string[]} NameOrNames */
/** @typedef {{ allowSymlinks?: boolean}} FindOptions */

/** @type {(directory: UrlOrPath) => string} */
const toAbsolutePath = (directory) => path.resolve(toPath(directory))

/**
 * Find matched name or names in a directory
 * @param {UrlOrPath} directory
 * @param {NameOrNames} nameOrNames
 * @param {Predicate} predicate
 * @returns {Promise<string>}
 */
async function findInDirectory(directory, nameOrNames, predicate) {
  directory = toAbsolutePath(directory)
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  for (const name of names) {
    const file = path.join(directory, name)

    // eslint-disable-next-line no-await-in-loop
    if (await predicate(file)) {
      return file
    }
  }
}

/** @type {(...predicates: Predicate[]) => Predicate} */
const combinePredicates =
  (...predicates) =>
  async (path) => {
    for (const predicate of predicates) {
      if (!predicate) {
        continue
      }

      // eslint-disable-next-line no-await-in-loop
      if ((await predicate(path)) === false) {
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
 */
function findFile(directory, nameOrNames, predicate, options) {
  if (typeof predicate !== 'function' && !options) {
    options = predicate
    predicate = undefined
  }

  predicate = combinePredicates(
    (file) => checkType(file, 'isFile', options),
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
 */
function findDirectory(directory, nameOrNames, predicate, options) {
  if (typeof predicate !== 'function' && !options) {
    options = predicate
    predicate = undefined
  }

  predicate = combinePredicates(
    (file) => checkType(file, 'isDirectory', options),
    predicate,
  )

  return findInDirectory(directory, nameOrNames, predicate)
}

export {findFile, findDirectory}
