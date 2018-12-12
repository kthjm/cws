const compose = require('chin-plugin-compose')
const convertsvg = require('chin-plugin-convert-svg')
const filename = require('chin-plugin-filename')
const { workspace, targets } = require('./variables.json')

const sizes = [
  16,
  48,
  128,
]

module.exports = [].concat(
  ...targets.map(name =>
    sizes.map((size, index) => ({
      put: `${workspace}/${name}/icons`,
      out: `${workspace}/${name}/src/icons`,
      clean: index === 0,
      processors: {
        svg: compose([
          convertsvg('.png', {
            height: size,
            puppeteer: { args: ['--no-sandbox'] }
          }),
          filename({
            name: size
          }),
        ])
      }
    }))
  )
)