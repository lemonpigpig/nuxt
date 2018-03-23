export default function ({ isClient, store, redirect, route, req, res }) {
  store.commit('common/setBreadCrumbVisibility', false)
  store.commit('common/setShowNavigation', true)
  store.commit('common/setShowTopHeader', true)
  store.commit('common/setShowMainHeader', true)
  store.commit('common/setShowMainHeaderCategory', false)
  if (route.path !== '/cart') {
    store.commit('common/setHeaderCartShow', true)
  }
  if (route.path === '/category/first') {
    store.commit('common/setShowMainHeaderCategory', true)
  }
  if (route.path === '/downloadapp') {
    const ua = req.headers['user-agent'].toLowerCase()
    let redirectUrl = '/'
    if (/iphone|ipad|ipod/.test(ua)) {
      redirectUrl = 'https://itunes.apple.com/us/app/id1207752755'
    } else if (/android/.test(ua)) {
      redirectUrl = 'http://sj.qq.com/myapp/detail.htm?apkName=com.gznb.b2c'
    }
    res.writeHead(302, { 'Location': redirectUrl })
    res.end('ok')
  }
}
