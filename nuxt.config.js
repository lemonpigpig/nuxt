const BabiliPlugin = require('babili-webpack-plugin')

const env = require(`./config/env.json`)
const serverCache = require('./server/server-cache')

module.exports = {
  rootDir: process.cwd(),
  dev: (process.env.NODE_ENV === 'development'),
  /**
   * 客户端和服务端共享的环境变量
   */
  env,
  /*
   ** Headers of the page
   */
  head: {
    title: 'xxx',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=1200, initial-scale=1'},
      {hid: 'Description', name: 'Description', content: 'xxx'},
      {hid: 'Keywords', name: 'Keywords', content: 'xxx'},
      {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/img/favicon-gznb.ico'}
    ]
  },
  router: {
    middleware: 'check-auth',
    extendRoutes (routes) {
      routes.find(r => r.name === 'home').path = '/'
    }
  },
  /*
   ** Global CSS
   */
  css: [
    '~assets/css/main.css',
    'gz-vue/dist/style.css',
    'swiper/dist/css/swiper.css',
    { src: '~assets/less/main.less', lang: 'less' }
  ],
  /*
   ** Add axios globally
   */
  build: {
    babel: {
      presets: ['es2015', 'stage-2'],
      plugins: ['transform-runtime']
    },
    extractCSS: true,
    vendor: [
      'babel-polyfill',
      'axios',
      'gz-vue',
      'gz-vue/public/img/gz-vue/icons/icons-symbol.js', // it's icon, don't remove.
      'swiper'
    ],
    /*
     ** Run ESLINT on save
     */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (!process.dev) {
        // to fix uglify bug use babeli instead of uglifyn
        config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== 'UglifyJsPlugin')
        config.plugins.push(new BabiliPlugin())
        // add debug mapping for browser
        config.devtool = 'source-map'
      }
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['last 5 versions']
      })
    ]
  },
  plugins: [{src: '~/plugins/gz-vue', ssr: true},
    {src: '~/plugins/custom-axios', ssr: true}],
  modules: ['@nuxtjs/proxy'],
  proxy: {
    '/api': {
      target: env.baseURL,
      changeOrigin: true,
      pathRewrite: {
        '^/api/': ''
      }
    }
  },
  serverMiddleware: [
    {
      path: '/downloadapp.html',
      handler: (req, res) => {
        res.writeHead(301, {Location: 'https://app-b2c.gznb.com/downloadapp'})
        res.end()
      }
    },
    {
      path: '//', // connect匹配首页要用'//'， '/'会被转化成''
      handler: serverCache({ maxAge: 1000 * 60 * 60 })
    }
  ]
}
