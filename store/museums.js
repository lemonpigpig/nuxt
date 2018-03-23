import Vue from 'vue'
import MuseumsService from '../services/museums-service'

export const state = () => ({
  museumsInfoFromGoods: {},
  museumDetail: {},
  museumsInCityArea: [],
  goodsByMuseumId: [],
  hotMuseums: [],
  museumsPaging: {
    total: 0,
    currentPage: 1,
    pageSize: 12,
    pageCount: 0
  },
  museumGoodsPaging: {
    total: 0,
    currentPage: 1,
    pageSize: 12,
    pageCount: 0
  }
})

export const mutations = {
  setMuseumsInfoFromGoods (state, data) {
    Vue.set(state, 'museumsInfoFromGoods', data)
  },
  setMuseumDetail (state, data) {
    Vue.set(state, 'museumDetail', data)
  },
  setGoodsByMuseumId (state, data) {
    Vue.set(state, 'goodsByMuseumId', data)
  },
  setHotMuseums (state, data) {
    Vue.set(state, 'hotMuseums', data)
  },
  setMuseumsPaging (state, data) {
    Vue.set(state, 'museumsPaging', data)
  },
  setMuseumGoodsPaging (state, data) {
    Vue.set(state, 'museumGoodsPaging', data)
  }
}
export const actions = {
  getMuseumsByCode ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      MuseumsService.getMuseumsByCode(queryCondition)
      .then((res) => {
        commit('setMuseumsInfoFromGoods', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getMuseumDetail ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      MuseumsService.getMuseumDetail(queryCondition)
      .then((res) => {
        commit('setMuseumDetail', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getMuseumsByCitycode ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      MuseumsService.getMuseumsByCitycode(queryCondition)
      .then((res) => {
        if (res.data && res.data.itemList) {
          commit('setHotMuseums', res.data.itemList)
          commit('setMuseumsPaging', res.data.paging)
          resolve(res.data)
        } else {
          commit('setHotMuseums', [])
          resolve({})
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getGoodsByMuseumId ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      MuseumsService.getGoodsByMuseumId(queryCondition)
      .then((res) => {
        if (res.data && res.data.itemList) {
          commit('setGoodsByMuseumId', res.data.itemList)
          commit('setMuseumGoodsPaging', res.data.paging)
          resolve(res.data)
        } else {
          commit('setGoodsByMuseumId', [])
          resolve({})
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getHotMuseums ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      MuseumsService.getHotMuseums(queryCondition)
      .then((res) => {
        if (res.data && res.data.itemList) {
          commit('setHotMuseums', res.data.itemList)
          commit('setMuseumsPaging', res.data.paging)
          resolve(res.data)
        } else {
          commit('setHotMuseums', [])
          resolve({})
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getNewMuseums ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      MuseumsService.getNewMuseums(queryCondition)
      .then((res) => {
        if (res.data && res.data.itemList) {
          commit('setHotMuseums', res.data.itemList)
          commit('setMuseumsPaging', res.data.paging)
          resolve(res.data.itemList)
        } else {
          commit('setHotMuseums', [])
          resolve([])
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
