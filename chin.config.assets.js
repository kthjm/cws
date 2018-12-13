const inkscape = require('chin-plugin-inkscape').default
const { join } = require('path')
const { chenv } = require('./package.json')

const width = 2000

module.exports = Object.values(chenv.items).map(({ src }) => ({
  put: join(src, '../assets'),
  out: join(src, '../.assets'),
  clean: true,
  processors: [
    ['svg2png', { svg: inkscape('png', { width }) }]
  ]
}))
