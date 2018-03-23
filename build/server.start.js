const Nuxt = require('nuxt')

const options = require('../nuxt.config')
if (options.env.name === 'production') {
  require('tingyun')
}

if (options.env.tingyun) {
  require('tingyun')
}

const nuxt = module.exports = new Nuxt(options)
const port = options.env.port || process.env.npm_package_config_nuxt_port
const host = options.env.host || process.env.npm_package_config_nuxt_host
nuxt.server = new nuxt.Server(nuxt).listen(port, host)
