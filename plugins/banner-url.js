export default (moduleType, moduleId) => {
  let url = null
  if (moduleType === 'otherLinks') {
    url = moduleId
    if (moduleId.indexOf('http://') < 0) {
      url = 'http://'.concat(moduleId)
    }
  } else {
    switch (moduleType) {
      case 'commonProduct':
      case 'newProduct':
      case 'buyLocal':
      case 'benefitList':
      case 'buyList':
        url = moduleId ? `/goods/${moduleId}` : ''
        break
      case 'orignProduct':
        url = moduleId !== '' ? `/goods/${moduleId}` : '/origin'
        break
      // case 'publicWelfare':
      //   url = moduleId !== '' ? `/publicWelfare/detail?id=${moduleId}` : '/publicWelfare'
      //   break
      case 'secKill':
        url = moduleId !== '' ? `/goods/${moduleId}` : '/flashsale'
        break
      case 'productCategory':
        url = moduleId ? `/category/${moduleId}` : ''
        break
      case 'museumShop':
        url = moduleId !== '' ? `/museums/${moduleId}` : '/museums'
        break
      case 'searchResult':
        url = moduleId ? `/category?k=${moduleId}` : ''
        break
      case 'activity':
        url = '/activityHomePage'
        break
      case 'topic':
        url = '/topic'
        break
      case 'activityPage':
        url = `/promotion/${moduleId}`
        break
      case 'onlyShow':
        return
        // break
      default:
        url = moduleId ? `/goods/${moduleId}` : ''
    }
  }
  return url
}
