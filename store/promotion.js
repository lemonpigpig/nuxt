import Vue from 'vue'
import PromotionService from '../services/promotionService'

export const state = () => ({
  promotionList: [],
  couponsList: [],
  poolGoods: [],
  goodsCouponsList: []
})

export const mutations = {
  // setOrder (state, data) {
  //   Vue.set(state, 'orderList', Object.assign({}, data))
  // },
  setPromotionList (state, data) {
    Vue.set(state, 'promotionList', Object.assign({}, data))
  },
  setCouponsList (state, data) {
    Vue.set(state, 'couponsList', data)
  },
  setGoodsPool (state, data) {
    Vue.set(state, 'poolGoods', data)
  },
  setGoodsCoupons (state, data) {
    Vue.set(state, 'goodsCouponsList', data)
  }
}
export const actions = {
  getPromotionList ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      PromotionService.getPromotionList(queryCondition)
      .then((res) => {
        commit('setPromotionList', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getCouponsList ({ commit }) {
    return new Promise((resolve, reject) => {
      PromotionService.getCouponsList()
      .then((res) => {
        commit('setCouponsList', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getCouponsByGoodsId ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      PromotionService.getCouponsByGoodsId(queryCondition)
      .then((res) => {
        commit('setGoodsCoupons', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  receiveCoupon ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      PromotionService.receiveCoupon(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getPoolGoodsBytype ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      PromotionService.getPoolGoodsBytype(queryCondition)
      .then((res) => {
        commit('setGoodsPool', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
