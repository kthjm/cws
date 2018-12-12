const compose = require('chin-plugin-compose')
const convertsvg = require('chin-plugin-convert-svg')
const filename = require('chin-plugin-filename')
const { cws } = require('./package.json')

const { base, items } = cws
const sizes = [16, 48, 128]

module.exports = [].concat(
  ...Object.keys(items).map(name =>
    sizes.map((size, index) => ({
      put: `${base}/${name}/icons`,
      out: `${base}/${name}/src/icons`,
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