import * as url from 'node:url'
import {expectType} from 'tsd'
import {findFile, findDirectory} from './index.js'

// `nameOrNames`
expectType<string | void>(await findFile('name'))
expectType<string | void>(await findDirectory('name'))
expectType<string | void>(await findFile(['a', 'b']))
expectType<string | void>(await findDirectory(['a', 'b']))

// `options`
expectType<string | void>(await findFile('name', {}))
expectType<string | void>(await findDirectory('name', {}))
expectType<string | void>(await findDirectory('name', undefined))

// `options.cwd`
expectType<string | void>(await findFile('name'))
expectType<string | void>(await findDirectory('name'))
expectType<string | void>(await findFile('name', {cwd: '/path/to/directory/'}))
expectType<string | void>(
  await findDirectory('name', {cwd: '/path/to/directory/'}),
)
expectType<string | void>(
  await findFile('name', {cwd: url.pathToFileURL('/path/to/directory/')}),
)
expectType<string | void>(
  await findDirectory('name', {cwd: url.pathToFileURL('/path/to/directory/')}),
)
expectType<string | void>(
  await findFile('name', {cwd: url.pathToFileURL('/path/to/directory/').href}),
)
expectType<string | void>(
  await findDirectory('name', {
    cwd: url.pathToFileURL('/path/to/directory/').href,
  }),
)

// `options.filter`
expectType<string | void>(await findFile('name', {filter: () => true}))
expectType<string | void>(await findDirectory('name', {filter: () => true}))
expectType<string | void>(
  await findFile('name', {filter: () => Promise.resolve(false)}),
)
expectType<string | void>(
  await findDirectory('name', {filter: () => Promise.resolve(false)}),
)
expectType<string | void>(
  await findFile('name', {filter: ({name}) => name === 'name'}),
)
expectType<string | void>(
  await findFile('name', {filter: ({path}) => path === path}),
)
expectType<string | void>(
  await findFile('name', {filter: ({stats}) => stats.mtimeMs < Date.now()}),
)

// `options.allowSymlinks`
expectType<string | void>(await findFile('name', {allowSymlinks: true}))
expectType<string | void>(await findDirectory('name', {allowSymlinks: true}))
expectType<string | void>(await findFile('name', {allowSymlinks: false}))
expectType<string | void>(await findDirectory('name', {allowSymlinks: false}))
