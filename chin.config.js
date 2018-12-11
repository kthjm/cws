const inkscape = require('chin-plugin-inkscape').default

const workspace = 'items'

module.exports = [
  'img-skewer',
  'img-utmost',
].map(name => ({
  put: `${workspace}/${name}/assets`,
  out: `${workspace}/${name}/.assets`,
  clean: true,
  processors: [
    ['svg2png', { svg: inkscape('png', { width: 2000 }) }]
  ]
}))