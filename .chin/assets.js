const inkscape = require('chin-plugin-inkscape').default
const { workspace, targets } = require('./variables.json')

module.exports = targets.map(name => ({
  put: `${workspace}/${name}/assets`,
  out: `${workspace}/${name}/.assets`,
  clean: true,
  processors: [
    ['svg2png', { svg: inkscape('png', { width: 2000 }) }]
  ]
}))