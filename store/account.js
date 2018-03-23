import Vue from 'vue'
import { cloneDeep } from 'lodash'
import accountService from '../services/account-service'
import goodsService from '../services/goods-service'
import userService from '../services/user-service'

export const state = () => ({
  noticeData: {
    noticeList: [],
    paging: {}
  },
  couponList: [],
  favoritesList: [],
  favoritesGoodsItemList: [],
  favoritesIdList: [],
  newsDetail: {},
  componentsInfo: {
    index: 0,
    name: ''
  }
})

export const getters = {
  favoritesGoodsItemList (state) {
    return state.favoritesGoodsItemList
  }
}

export const mutations = {
  setnoticeData (state, data) {
    Vue.set(state.noticeData, 'noticeList', Object.assign({}, data.itemList))
    Vue.set(state.noticeData, 'paging', data.paging)
  },
  setCouponList (state, data) {
    Vue.set(state, 'couponList', cloneDeep(data))
  },
  setNewsDetail (state, data) {
    Vue.set(state, 'newsDetail', cloneDeep(data))
  },
  setFavoritesList (state, data) {
    if (data && data.itemList) {
      Vue.set(state, 'favoritesList', data.itemList.map(item => Object.assign({}, item)))
      Vue.set(state, 'favoritesIdList', data.itemList.map(item => item.id))
    } else {
      Vue.set(state, 'favoritesList', [])
      Vue.set(state, 'favoritesIdList', [])
    }
  },
  setFavoritesGoodsItemList (state, data) {
    const formatGoodsItemList = []
    data && data.itemList && data.itemList.map((item) => {
      formatGoodsItemList.push(item.id)
    })
    Vue.set(state, 'favoritesGoodsItemList', formatGoodsItemList)
  },
  updateFavoritesGoodsItem (state, data) {
    Vue.set(state, 'favoritesGoodsItemList', data)
  },
  setComponent(state, data) { //eslint-disable-line
    Vue.set(state.componentsInfo, 'index', data.index)
    Vue.set(state.componentsInfo, 'name', data.name)
  }
}
export const actions = {
  getStore  ({ commit }) {
    return new Promise((resolve, reject) => {
      userService.getStore()
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getStores ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      userService.getStores(queryCondition)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  setStore ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      userService.setStore(queryCondition)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  updateStore ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      userService.updateStore(queryCondition)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  submitAdvise ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      accountService.submitAdvise(queryCondition)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getnoticeList ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      accountService.noticeList(queryCondition)
        .then((res) => {
          if (res.data && res.data.itemList.length) {
            commit('setnoticeData', res.data)
            resolve(res.data)
          } else {
            commit('setnoticeData', [])
            resolve([])
          }
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getNewsDetial ({ commit }, id) {
    return new Promise((resolve, reject) => {
      accountService.getNewsDetial(id)
        .then((res) => {
          if (res.data) {
            commit('setNewsDetail', res.data)
            resolve(res.data)
          } else {
            commit('setnoticeData', [])
            resolve([])
          }
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getFavoritesList ({ commit }) {
    return new Promise((resolve, reject) => {
      accountService.getFavoritesList()
        .then((res) => {
          commit('setFavoritesList', res.data)
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getCouponList ({ commit }) {
    return new Promise((resolve, reject) => {
      accountService.getCouponList()
      .then((res) => {
        commit('setCouponList', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getFavoritesGoodsItemList ({ commit, state }) {
    return new Promise((resolve, reject) => {
      accountService.getFavoritesList()
        .then((res) => {
          commit('setFavoritesGoodsItemList', res.data)
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  collectDeleteSingle ({ commit }, id) {
    return new Promise((resolve, reject) => {
      accountService.collectDeleteSingle(id)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  deleleSingleFavoriteGoods ({ commit, state }, id) {
    const deleteId = id
    goodsService.deleteSingleFavoriteGoods(id)
      .then((res) => {
        const index = state.favoritesGoodsItemList.findIndex(item => item.goodsId - deleteId === 0)
        const favorites = state.favoritesGoodsItemList
        favorites.splice(index, 1)
        commit('updateFavoritesGoodsItem', favorites)
        // console.log('deleleSingleFavoriteGoods:', state.favoritesGoodsItemList)
        return Promise.resolve(res)
      }).catch((err) => {
        return Promise.reject(err)
      })
  },
  addGoodsToFavorite ({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      goodsService.addGoodsToFavorite({ GoodsIds: [id] })
        .then((res) => {
          const favorites = state.favoritesGoodsItemList
          favorites.push(id)
          commit('updateFavoritesGoodsItem', favorites)
          resolve(res && res.data)
        })
        .catch((error) => {
          reject(error.msg || error)
        })
    })
  },
  deleteFavouritesAll ({ commit }, ids) {
    return new Promise((resolve, reject) => {
      accountService.deleteFavouritesAll(ids)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  modifyPassword ({ commit }, passwordInfo) {
    return new Promise((resolve, reject) => {
      accountService.modifyPassword(passwordInfo)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  goComponent ({ commit }, res) {
    if (res.index && res.name) {
      commit('setComponent', res)
    }
  }
}
