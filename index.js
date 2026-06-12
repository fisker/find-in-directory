import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import {toAbsolutePath} from 'url-or-path'

/**
@import {OptionalUrlOrPath} from 'url-or-path'
@import {Stats} from 'node:fs'

@typedef {(fileOrDirectory: FileOrDirectory) => Promise<boolean> | boolean} Filter

@typedef {'file' | 'directory'} Type

@typedef {{
  name: string,
  path: string,
  stats: Stats,
}} FileOrDirectory

@typedef {{
  name: string,
  type?: Type,
  filter?: Filter
}} ObjectTarget
@typedef {string | ObjectTarget} Target
@typedef {Target | Target[]} TargetOrTargets

@typedef {string | Omit<ObjectTarget, 'type'>} TargetWithoutType
@typedef {TargetWithoutType | TargetWithoutType[]} TargetOrTargetsWithoutType

@typedef {{
  cwd?: OptionalUrlOrPath,
  type?: Type
  filter?: Filter
  allowSymlinks?: boolean,
}} FindOptions

@typedef {Filter | FindOptions} FilterOrOptions
@typedef {Filter | Omit<FindOptions, 'type'>} FilterOrOptionsWithoutType

@typedef {Omit<FindOptions, 'filter'>} OptionsWithoutFilter
@typedef {Omit<OptionsWithoutFilter, 'type'>} OptionsWithoutFilterAndType

@typedef {Promise<string | undefined>} FindResult
*/

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
@param {Stats} stats
@param {Type | undefined} type
*/
function isTypeSatisfied(stats, type) {
  return (
    !type ||
    (type === 'file' && stats.isFile()) ||
    (type === 'directory' && stats.isDirectory())
  )
}

/**
@param {TargetOrTargets} targetOrTargets
@param {FilterOrOptions | undefined} filterOrOptions
@param {OptionsWithoutFilter | undefined} optionsWithoutFilter
@param {Type} [type]
*/
async function findInternal(
  targetOrTargets,
  filterOrOptions,
  optionsWithoutFilter,
  type,
) {
  const targets = Array.isArray(targetOrTargets)
    ? targetOrTargets
    : [targetOrTargets]
  const options =
    typeof filterOrOptions === 'function'
      ? {...optionsWithoutFilter, filter: filterOrOptions}
      : {...filterOrOptions}
  const shouldIgnoreTargetType = Boolean(type)
  if (shouldIgnoreTargetType) {
    options.type = type
  }

  const {cwd, allowSymlinks = true} = options
  const directory = toAbsolutePath(cwd) ?? process.cwd()

  for (let target of targets) {
    if (typeof target === 'string') {
       
      target = {name: target}
    }

    const fileOrDirectory = path.join(directory, target.name)
    const stats = await safeStat(fileOrDirectory, allowSymlinks)

    // Target doesn't exists
    if (!stats) {
      continue
    }

    const type = shouldIgnoreTargetType
      ? options.type
      : (options.type ?? target.type)

    // Type doesn't satisfy
    if (!isTypeSatisfied(stats, type)) {
      continue
    }

    if (options.filter || target.filter) {
      const file = {name: target.name, path: fileOrDirectory, stats}

      if (
        // `options.filter` not matched
        (options.filter && !(await options.filter(file))) ||
        // `target.filter` not matched
        (target.filter && !(await target.filter(file)))
      ) {
        continue
      }
    }

    return fileOrDirectory
  }
}

/**
Find matched file or files in a directory.

@param {TargetOrTargetsWithoutType} targetOrTargets
@param {FilterOrOptionsWithoutType} [filterOrOptions]
@param {OptionsWithoutFilterAndType} [optionsWithoutFilter]
@returns {FindResult}

@example
```js
import {findFileInDirectory} from 'find-in-directory'

console.log(await findFileInDirectory(['foo.config.js', 'foo.config.json']))
// "/path/to/foo.config.json"
```
*/
function findFileInDirectory(
  targetOrTargets,
  filterOrOptions,
  optionsWithoutFilter,
) {
  return findInternal(
    targetOrTargets,
    filterOrOptions,
    optionsWithoutFilter,
    'file',
  )
}

/**
Find matched directory or directories in a directory.

@param {TargetOrTargetsWithoutType} targetOrTargets
@param {FilterOrOptionsWithoutType} [filterOrOptions]
@param {OptionsWithoutFilterAndType} [optionsWithoutFilter]
@returns {FindResult}

@example
```js
import {findDirectoryInDirectory} from 'find-in-directory'

console.log(await findDirectoryInDirectory(['node_modules', '.yarn']))
// "/path/to/node_modules"
```
*/
function findDirectoryInDirectory(
  targetOrTargets,
  filterOrOptions,
  optionsWithoutFilter,
) {
  return findInternal(
    targetOrTargets,
    filterOrOptions,
    optionsWithoutFilter,
    'directory',
  )
}

/**
Find matched directories or files in a directory.

@param {TargetOrTargets} targetOrTargets
@param {FilterOrOptions} [filterOrOptions]
@param {OptionsWithoutFilter} [optionsWithoutFilter]
@returns {FindResult}

@example
```js
import {findInDirectory} from 'find-in-directory'

console.log(
  await findInDirectory([
    {name: 'yarn.lock', type: 'file'},
    {name: '.yarn', type: 'directory'},
  ]),
)
// "/path/to/yarn.lock"
```
*/
function findInDirectory(
  targetOrTargets,
  filterOrOptions,
  optionsWithoutFilter,
) {
  return findInternal(targetOrTargets, filterOrOptions, optionsWithoutFilter)
}

export {findDirectoryInDirectory, findFileInDirectory, findInDirectory}
