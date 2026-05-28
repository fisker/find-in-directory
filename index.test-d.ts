import * as url from 'node:url'
import {expectType} from 'tsd'
import {findFile, findDirectory} from './index.js'

// `nameOrNames`
expectType<string | undefined>(await findFile('name'))
expectType<string | undefined>(await findDirectory('name'))
expectType<string | undefined>(await findFile(['a', 'b']))
expectType<string | undefined>(await findDirectory(['a', 'b']))

// `options`
expectType<string | undefined>(await findFile('name', {}))
expectType<string | undefined>(await findDirectory('name', {}))
expectType<string | undefined>(await findDirectory('name', undefined))

// `options.cwd`
expectType<string | undefined>(await findFile('name'))
expectType<string | undefined>(await findDirectory('name'))
expectType<string | undefined>(
  await findFile('name', {cwd: '/path/to/directory/'}),
)
expectType<string | undefined>(
  await findDirectory('name', {cwd: '/path/to/directory/'}),
)
expectType<string | undefined>(
  await findFile('name', {cwd: url.pathToFileURL('/path/to/directory/')}),
)
expectType<string | undefined>(
  await findDirectory('name', {cwd: url.pathToFileURL('/path/to/directory/')}),
)
expectType<string | undefined>(
  await findFile('name', {cwd: url.pathToFileURL('/path/to/directory/').href}),
)
expectType<string | undefined>(
  await findDirectory('name', {
    cwd: url.pathToFileURL('/path/to/directory/').href,
  }),
)

// `options.filter`
expectType<string | undefined>(await findFile('name', {filter: () => true}))
expectType<string | undefined>(
  await findDirectory('name', {filter: () => true}),
)
expectType<string | undefined>(
  await findFile('name', {filter: () => Promise.resolve(false)}),
)
expectType<string | undefined>(
  await findDirectory('name', {filter: () => Promise.resolve(false)}),
)
expectType<string | undefined>(
  await findFile('name', {filter: ({name}) => name === 'name'}),
)
expectType<string | undefined>(
  await findFile('name', {filter: ({path}) => path === path}),
)
expectType<string | undefined>(
  await findFile('name', {filter: ({stats}) => stats.mtimeMs < Date.now()}),
)

// `options.allowSymlinks`
expectType<string | undefined>(await findFile('name', {allowSymlinks: true}))
expectType<string | undefined>(
  await findDirectory('name', {allowSymlinks: true}),
)
expectType<string | undefined>(await findFile('name', {allowSymlinks: false}))
expectType<string | undefined>(
  await findDirectory('name', {allowSymlinks: false}),
)
