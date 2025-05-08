import {findDirectory, findFile} from './index.js'

console.log(
  await Promise.all([findFile(['index.js']), findDirectory(['.git'])]),
)
