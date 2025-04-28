import * as url from 'node:url'
import {expectType} from 'tsd'
import {findFile, findDirectory} from './index.js'

// `directory`
expectType<string | void>(await findFile('/path/to/directory/', 'name'))
expectType<string | void>(await findDirectory('/path/to/directory/', 'name'))
expectType<string | void>(
  await findFile(url.pathToFileURL('/path/to/directory/'), 'name'),
)
expectType<string | void>(
  await findDirectory(url.pathToFileURL('/path/to/directory/'), 'name'),
)
expectType<string | void>(
  await findFile(url.pathToFileURL('/path/to/directory/').href, 'name'),
)
expectType<string | void>(
  await findDirectory(url.pathToFileURL('/path/to/directory/').href, 'name'),
)

// `nameOrNames`
expectType<string | void>(await findFile('/path/to/directory/', 'name'))
expectType<string | void>(await findDirectory('/path/to/directory/', 'name'))
expectType<string | void>(await findFile('/path/to/directory/', ['a', 'b']))
expectType<string | void>(
  await findDirectory('/path/to/directory/', ['a', 'b']),
)

// `predicate`
expectType<string | void>(
  await findFile('/path/to/directory/', 'name', () => true),
)
expectType<string | void>(
  await findDirectory('/path/to/directory/', 'name', () => true),
)
expectType<string | void>(
  await findFile('/path/to/directory/', 'name', () => Promise.resolve(false)),
)
expectType<string | void>(
  await findDirectory('/path/to/directory/', 'name', () =>
    Promise.resolve(false),
  ),
)
expectType<string | void>(
  await findFile('/path/to/directory/', 'name', ({name}) => name === 'name'),
)
expectType<string | void>(
  await findFile('/path/to/directory/', 'name', ({path}) => path === path),
)

// `options`
expectType<string | void>(
  await findFile('/path/to/directory/', 'name', {allowSymlinks: true}),
)
expectType<string | void>(
  await findDirectory('/path/to/directory/', 'name', {allowSymlinks: true}),
)
expectType<string | void>(
  await findFile('/path/to/directory/', 'name', {allowSymlinks: false}),
)
expectType<string | void>(
  await findDirectory('/path/to/directory/', 'name', {allowSymlinks: false}),
)
expectType<string | void>(await findFile('/path/to/directory/', 'name', {}))
expectType<string | void>(
  await findDirectory('/path/to/directory/', 'name', {}),
)

// `predicate` and `options`
expectType<string | void>(
  await findFile('/path/to/directory/', 'name', () => true, {
    allowSymlinks: false,
  }),
)
expectType<string | void>(
  await findDirectory('/path/to/directory/', 'name', () => true, {
    allowSymlinks: false,
  }),
)
