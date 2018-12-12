const inkscape = require('chin-plugin-inkscape').default
const { cws } = require('./package.json')

const { base, items } = cws

module.exports = Object.keys(items).map(name => ({
  put: `${base}/${name}/assets`,
  out: `${base}/${name}/.assets`,
  clean: true,
  processors: [
    ['svg2png', { svg: inkscape('png', { width: 2000 }) }]
  ]
}))