import Vue from 'vue'
import CommonService from '../services/common-service'

export const state = () => ({
  counter: 0,
  floorList: [],
  showBreadCrumb: true,
  showNavigation: true,
  showTopHeader: true,
  showMainHeader: true,
  showCategory: false,
  breadCrumbList: [],
  firstLevelAreaList: [],
  secondLevelAreaList: [],
  thirdLevelAreaList: [],
  keywords: '',
  currentActivePage: '',
  showHeaderCart: false,
  showMainHeaderCategory: false,
  globleMessage: '',
  currentCategory: '全部分类',
  firstCategory: {},
  category: []
})

export const getters = {
  showHeaderCart (state) {
    return state.showHeaderCart
  },
  showMainHeaderCategory (state) {
    return state.showMainHeaderCategory
  }
}

export const mutations = {
  setShowCategory (state, data) {
    Vue.set(state, 'showCategory', data)
  },
  increment (state) {
    state.counter++
  },
  setFloor (state, data) {
    Vue.set(state, 'floorList', data.map(item => Object.assign({}, item)))
  },
  setBreadCrumbVisibility (state, data) {
    Vue.set(state, 'showBreadCrumb', data)
  },
  setShowNavigation (state, data) {
    Vue.set(state, 'showNavigation', data)
  },
  setShowTopHeader (state, data) {
    Vue.set(state, 'showTopHeader', data)
  },
  setShowMainHeader (state, data) {
    Vue.set(state, 'showMainHeader', data)
  },
  setKeywords (state, data) {
    Vue.set(state, 'keywords', data)
  },
  setBreadCrumbList (state, data) {
    Vue.set(state, 'breadCrumbList', data.map(item => Object.assign({}, item)))
  },
  firstLevelAreaList (state, data) {
    Vue.set(state, 'firstLevelAreaList', data)
  },
  secondLevelAreaList (state, data) {
    Vue.set(state, 'secondLevelAreaList', data)
  },
  thirdLevelAreaList (state, data) {
    Vue.set(state, 'thirdLevelAreaList', data)
  },
  setCurrentActivePage (state, page) {
    Vue.set(state, 'currentActivePage', page)
  },
  setHeaderCartShow (state, data) {
    Vue.set(state, 'showHeaderCart', data)
  },
  setShowMainHeaderCategory (state, data) {
    Vue.set(state, 'showMainHeaderCategory', data)
  },
  setMessage (state, message) {
    if (message instanceof Error) {
      return
    }
    let myMesg = ''
    if (message) {
      myMesg = message.msg ? message.msg : message
      const myCode = message.code ? message.code : ''
      if (Number(myCode) === 1017 || (typeof myMesg === 'string' && myMesg.indexOf('未登录') > -1)) {
        return
      }
    }
    Vue.set(state, 'globleMessage', myMesg)
  },
  setCurrentCategory (state, data) {
    if (data) {
      Vue.set(state, 'currentCategory', data)
    }
  },
  setFirstCategory (state, data) {
    let firstCategory = state.firstCategory
    if (data.code !== '') {
      state.category.forEach((item) => {
        if (item.code === data.code) {
          firstCategory = item
        }
      })
    }
    if (typeof firstCategory.subCategories !== 'object') {
      return
    }
    let newFirstSubCategory = firstCategory.subCategories.map((subItem) => {
      let icon = ''
      if (data.hoverCode === subItem.code) {
        icon = subItem.hoverIcon === '' ? '/img/category-icon-hover.svg' : subItem.hoverIcon
      } else {
        icon = subItem.icon === '' ? '/img/category-icon.svg' : subItem.icon
      }
      subItem.currenticon = icon
      return subItem
    })
    firstCategory.subCategories = newFirstSubCategory
    Vue.set(state, 'firstCategory', firstCategory)
  },
  setCategory (state, data) {
    data.forEach((data) => {
      data.currenticon = data.icon === '' ? '/img/category-icon.svg' : data.icon
    })
    Vue.set(state, 'category', data.slice(0, 10))
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.user) {
      console.log(req.session)
    } else {
      // console.log(req)
    }
  },
  getFloor ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getFloor(queryCondition)
        .then((res) => {
          commit('setFloor', res.data)
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getUpload ({ commit }) {
    return new Promise((resolve, reject) => {
      CommonService.getUpload()
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getTopic ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getTopic(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getFirstLevelArea ({ commit }) {
    return new Promise((resolve, reject) => {
      CommonService.getFirstLevelArea()
        .then((res) => {
          commit('firstLevelAreaList', res.data)
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getLevelAreaByCode ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getLevelAreaByCode(queryCondition)
        .then((res) => {
          if (queryCondition.level === 2) {
            commit('secondLevelAreaList', res.data)
          } else if (queryCondition.level === 3) {
            commit('thirdLevelAreaList', res.data)
          }
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getHotKewards ({ commit }) {
    return new Promise((resolve, reject) => {
      CommonService.getHotKewards()
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getHotKewardsByPosition ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getHotKewardsByPosition(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getDefaultKeywords ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getDefaultKeywords(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getSeoKeywords ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getSeoKeywords(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getBanner ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getBanner(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getPageTypeIdByKey ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      CommonService.getPageTypeIdByKey(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },

  getCategory ({ commit }) {
    return new Promise((resolve, reject) => {
      CommonService.getCategory()
        .then((res) => {
          commit('setCategory', res.data)
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  }
}
