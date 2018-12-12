const path = require('path')

const hoPathProperty = (opts, key) =>
  ({ [key]: value }) =>
    typeof opts[key] === 'function'
    ? opts[key](value)
    : opts[key] || value

module.exports = (opts = {}) => {
  const gName = hoPathProperty(opts, 'name')
  const gExt = hoPathProperty(opts, 'ext')

  const processor = (data, { out, msg }) => {
    const name = gName(out)
    const ext = gExt(out)

    if (!opts.quiet) {
      msg(`"${name}${ext}"`)
    }

    const outpath = path.format({ ...out, name, ext })
    return [outpath, data]
  }

  return { isStream: false, options: {}, processor }
}