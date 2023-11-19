import url from 'node:url'
import test from 'ava'
import {findFile, findDirectory} from './index.js'

const fixtures = new URL('./fixtures/', import.meta.url)
const getPath = (path) => url.fileURLToPath(new URL(path, fixtures))

test('main', async (t) => {
  // Files
  t.is(await findFile(fixtures, 'a-file'), getPath('a-file'))
  t.is(await findFile(fixtures, ['a-file']), getPath('a-file'))
  t.is(await findFile(fixtures, ['non-exits-file']), undefined)

  // Directories
  t.is(await findDirectory(fixtures, 'a-directory'), getPath('a-directory'))
  t.is(await findDirectory(fixtures, ['a-directory']), getPath('a-directory'))
  t.is(await findDirectory(fixtures, ['non-exits-directory']), undefined)
})

test('Should only match exists files/directories', async (t) => {
  // Files
  t.is(await findFile(fixtures, ['a-file', 'non-exits-file']), getPath('a-file'))
  t.is(await findFile(fixtures, ['non-exits-file', 'a-file']), getPath('a-file'))
  t.is(await findFile(fixtures, ['non-exits-file', 'a-file'], () => true), getPath('a-file'))
  t.is(await findFile(fixtures, ['non-exits-file', 'a-directory', 'a-file'], () => true), getPath('a-file'))

  // Directories
  t.is(await findDirectory(fixtures, ['a-directory', 'non-exits-directory']), getPath('a-directory'))
  t.is(await findDirectory(fixtures, ['non-exits-directory', 'a-directory']), getPath('a-directory'))
  t.is(await findDirectory(fixtures, ['non-exits-directory', 'a-directory'], () => true), getPath('a-directory'))
  t.is(await findDirectory(fixtures, ['non-exits-directory', 'a-file', 'a-directory'], () => true), getPath('a-directory'))
})

test('Order matters', async (t) => {
  // Files
  t.is(await findFile(fixtures, ['a-file', 'b-file']), getPath('a-file'))
  t.is(await findFile(fixtures, ['b-file', 'a-file']), getPath('b-file'))

  // Directories
  t.is(await findDirectory(fixtures, ['a-directory', 'b-directory']), getPath('a-directory'))
  t.is(await findDirectory(fixtures, ['b-directory', 'a-directory']), getPath('b-directory'))
})

test('Predicate', async (t) => {
  // Files
  t.is(await findFile(fixtures, ['b-file', 'a-file'], (file) => file.endsWith('a-file')), getPath('a-file'))

  // Directories
  t.is(await findDirectory(fixtures, ['b-directory', 'a-directory'], (directory) => directory.endsWith('a-directory')), getPath('a-directory'))
})

test('Options', async (t) => {
  // Files
  t.is(await findFile(fixtures, ['link-to-a-file'], undefined, {allowSymlinks: true}), getPath('link-to-a-file'))
  t.is(await findFile(fixtures, ['link-to-a-file'], undefined, {allowSymlinks: false}), undefined)
  t.is(await findFile(fixtures, ['link-to-a-file'], () => true, {allowSymlinks: true}), getPath('link-to-a-file'))
  t.is(await findFile(fixtures, ['link-to-a-file'], () => true, {allowSymlinks: false}), undefined)
  t.is(await findFile(fixtures, ['link-to-a-file'], {allowSymlinks: true}), getPath('link-to-a-file'))
  t.is(await findFile(fixtures, ['link-to-a-file'], {allowSymlinks: false}), undefined)

  // Directories
  t.is(await findDirectory(fixtures, ['link-to-a-directory'], undefined, {allowSymlinks: true}), getPath('link-to-a-directory'))
  t.is(await findDirectory(fixtures, ['link-to-a-directory'], undefined, {allowSymlinks: false}), undefined)
  t.is(await findDirectory(fixtures, ['link-to-a-directory'], () => true, {allowSymlinks: true}), getPath('link-to-a-directory'))
  t.is(await findDirectory(fixtures, ['link-to-a-directory'], () => true, {allowSymlinks: false}), undefined)
  t.is(await findDirectory(fixtures, ['link-to-a-directory'], {allowSymlinks: true}), getPath('link-to-a-directory'))
  t.is(await findDirectory(fixtures, ['link-to-a-directory'], {allowSymlinks: false}), undefined)
})

test('Should accept url, absolute path, or relative path', async (t) => {
  // Files
  t.is(await findFile(fixtures.href, 'a-file'), getPath('a-file'))
  t.is(await findFile(url.fileURLToPath(fixtures), 'a-file'), getPath('a-file'))
  t.is(await findFile('./fixtures/', 'a-file'), getPath('a-file'))

  // Directories
  t.is(await findDirectory(fixtures.href, 'a-directory'), getPath('a-directory'))
  t.is(await findDirectory(url.fileURLToPath(fixtures), 'a-directory'), getPath('a-directory'))
  t.is(await findDirectory('./fixtures/', 'a-directory'), getPath('a-directory'))
})

test('Should work for deep names too', async (t) => {
  // Files
  t.is(await findFile(new URL('../', fixtures.href), 'fixtures/a-file'), getPath('a-file'))

  // Directories
  t.is(await findDirectory(new URL('../', fixtures.href), 'fixtures/a-directory'), getPath('a-directory'))
})
