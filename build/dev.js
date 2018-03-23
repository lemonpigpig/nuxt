// Show logs
process.env.DEBUG = 'nuxt:*'

const _ = require('lodash')
const debug = require('debug')('nuxt:build')
debug.color = 2 // force green color
const Nuxt = require('nuxt')
const chokidar = require('chokidar')
const resolve = require('path').resolve

let options = require('../nuxt.config')

const nuxt = module.exports = new Nuxt(options)
const port = options.env.port || process.env.npm_package_config_nuxt_port
const host = options.env.host || process.env.npm_package_config_nuxt_host
const server = nuxt.server = new nuxt.Server(nuxt).listen(port, host)
listenOnConfigChanges(nuxt, server)

function listenOnConfigChanges (nuxt, server) {
  // Listen on nuxt.config.js changes
  const build = _.debounce(() => {
    debug('[nuxt.config.js] changed')
    delete require.cache[nuxtConfigFile]

    options = require(nuxtConfigFile)
    nuxt.close()
      .then(() => {
        nuxt.renderer = null
        debug('Rebuilding the app...')
        return new Nuxt(options).build()
      })
      .then((nuxt) => {
        server.nuxt = nuxt
      })
      .catch((error) => {
        console.error('Error while rebuild the app:', error) // eslint-disable-line no-console
        process.exit(1)
      })
  }, 200)

  const nuxtConfigFile = resolve(options.rootDir, 'nuxt.config.js')
  chokidar.watch(nuxtConfigFile, Object.assign({}, nuxt.options.watchers.chokidar, {ignoreInitial: true}))
    .on('all', build)
}
