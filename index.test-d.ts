import * as url from 'node:url'
import {expectType, expectError} from 'tsd'
import {
  findFileInDirectory,
  findDirectoryInDirectory,
  findInDirectory,
} from './index.js'

for (const find of [
  findFileInDirectory,
  findDirectoryInDirectory,
  findInDirectory,
]) {
  // `targets`
  expectType<string | undefined>(await find('name'))
  expectType<string | undefined>(await find(['a', 'b']))

  // Object `Target`
  expectType<string | undefined>(await find({name: 'name'}))
  expectType<string | undefined>(await find(['a', {name: 'b'}]))

  // `Target.filter`
  expectType<string | undefined>(await find({name: 'name', filter: () => true}))
  expectType<string | undefined>(
    await find({name: 'name', filter: () => Promise.resolve(false)}),
  )

  // `options`
  expectType<string | undefined>(await find('name', {}))
  expectType<string | undefined>(await find('name', undefined))
  expectType<string | undefined>(await find('name', () => true))
  expectType<string | undefined>(await find('name', () => true, {}))

  // `options.cwd`
  expectType<string | undefined>(await find('name'))
  expectType<string | undefined>(
    await find('name', {cwd: '/path/to/directory/'}),
  )
  expectType<string | undefined>(
    await find('name', {cwd: url.pathToFileURL('/path/to/directory/')}),
  )
  expectType<string | undefined>(
    await find('name', {cwd: url.pathToFileURL('/path/to/directory/').href}),
  )

  // `options.filter`
  expectType<string | undefined>(await find('name', {filter: () => true}))
  expectType<string | undefined>(
    await find('name', {filter: () => Promise.resolve(false)}),
  )
  expectType<string | undefined>(
    await find('name', {filter: ({name}) => name === 'name'}),
  )
  expectType<string | undefined>(
    await find('name', {filter: ({path}) => path === path}),
  )
  expectType<string | undefined>(
    await find('name', {filter: ({stats}) => stats.mtimeMs < Date.now()}),
  )

  // `options.allowSymlinks`
  expectType<string | undefined>(await find('name', {allowSymlinks: true}))
  expectType<string | undefined>(await find('name', {allowSymlinks: false}))
}

// `Options.type`
expectType<string | undefined>(await findInDirectory('name', {type: 'file'}))
expectType<string | undefined>(
  await findInDirectory('name', {type: 'directory'}),
)
expectError(await findFileInDirectory('name', {type: 'file'}))
expectError(await findFileInDirectory('name', {type: 'directory'}))
expectError(await findDirectoryInDirectory('name', {type: 'directory'}))

// `target.type`
expectType<string | undefined>(
  await findInDirectory({name: 'name', type: 'file'}),
)
expectError(await findFileInDirectory({name: 'name', type: 'file'}))
expectError(await findFileInDirectory({name: 'name', type: 'directory'}))
expectError(await findDirectoryInDirectory({name: 'name', type: 'directory'}))
