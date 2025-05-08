import assert from 'node:assert/strict'
import test from 'node:test'
import url from 'node:url'
import {findDirectory, findFile} from './index.js'

const fixtures = new URL('./fixtures/', import.meta.url)
const getPath = (path) => url.fileURLToPath(new URL(path, fixtures))

test('main', async () => {
  // Files
  assert.equal(await findFile('a-file', {cwd: fixtures}), getPath('a-file'))
  assert.equal(await findFile(['a-file'], {cwd: fixtures}), getPath('a-file'))
  assert.equal(await findFile(['non-exits-file'], {cwd: fixtures}), undefined)

  // Directories
  assert.equal(
    await findDirectory('a-directory', {cwd: fixtures}),
    getPath('a-directory'),
  )
  assert.equal(
    await findDirectory(['a-directory'], {cwd: fixtures}),
    getPath('a-directory'),
  )
  assert.equal(
    await findDirectory(['non-exits-directory'], {cwd: fixtures}),
    undefined,
  )
})

test('Should only match exists files/directories', async () => {
  // Files
  assert.equal(
    await findFile(['a-file', 'non-exits-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await findFile(['non-exits-file', 'a-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await findFile(['non-exits-file', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )
  assert.equal(
    await findFile(['non-exits-file', 'a-directory', 'a-file'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await findDirectory(['a-directory', 'non-exits-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await findDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await findDirectory(['non-exits-directory', 'a-directory'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-directory'),
  )
  assert.equal(
    await findDirectory(['non-exits-directory', 'a-file', 'a-directory'], {
      cwd: fixtures,
      filter: () => true,
    }),
    getPath('a-directory'),
  )
})

test('Order matters', async () => {
  // Files
  assert.equal(
    await findFile(['a-file', 'b-file'], {cwd: fixtures}),
    getPath('a-file'),
  )
  assert.equal(
    await findFile(['b-file', 'a-file'], {cwd: fixtures}),
    getPath('b-file'),
  )

  // Directories
  assert.equal(
    await findDirectory(['a-directory', 'b-directory'], {cwd: fixtures}),
    getPath('a-directory'),
  )
  assert.equal(
    await findDirectory(['b-directory', 'a-directory'], {cwd: fixtures}),
    getPath('b-directory'),
  )
})

test('Predicate', async () => {
  // Files
  assert.equal(
    await findFile(['b-file', 'a-file'], {
      cwd: fixtures,
      filter: ({name}) => name === 'a-file',
    }),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await findDirectory(['b-directory', 'a-directory'], {
      cwd: fixtures,
      filter: ({name}) => name === 'a-directory',
    }),
    getPath('a-directory'),
  )
})

test('Options', async () => {
  // Files
  assert.equal(
    await findFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await findFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await findFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: true,
      filter: () => true,
    }),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await findFile(['link-to-a-file'], {
      cwd: fixtures,
      allowSymlinks: false,
      filter: () => true,
    }),
    undefined,
  )
  assert.equal(
    await findFile(['link-to-a-file'], {cwd: fixtures, allowSymlinks: true}),
    getPath('link-to-a-file'),
  )
  assert.equal(
    await findFile(['link-to-a-file'], {cwd: fixtures, allowSymlinks: false}),
    undefined,
  )

  // Directories
  assert.equal(
    await findDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await findDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await findDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await findDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      filter: () => true,
      allowSymlinks: false,
    }),
    undefined,
  )
  assert.equal(
    await findDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: true,
    }),
    getPath('link-to-a-directory'),
  )
  assert.equal(
    await findDirectory(['link-to-a-directory'], {
      cwd: fixtures,
      allowSymlinks: false,
    }),
    undefined,
  )
})

test('Should accept url, absolute path, or relative path', async () => {
  for (const cwd of [
    fixtures.href,
    url.fileURLToPath(fixtures),
    './fixtures/',
  ]) {
    // Files
    assert.equal(await findFile('a-file', {cwd}), getPath('a-file'))

    // Directories
    assert.equal(
      await findDirectory('a-directory', {cwd}),
      getPath('a-directory'),
    )
  }
})

test('Should work for deep names too', async () => {
  // Files
  assert.equal(
    await findFile('fixtures/a-file', {cwd: new URL('../', fixtures.href)}),
    getPath('a-file'),
  )

  // Directories
  assert.equal(
    await findDirectory('fixtures/a-directory', {
      cwd: new URL('../', fixtures.href),
    }),
    getPath('a-directory'),
  )
})
