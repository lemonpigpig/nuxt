import Vue from 'vue'
import GoodsBasicService from '../services/goods-basic-service'

export const state = () => ({
  goodsBasicInfo: {},
  specialGoods: [],
  promotionInfo: []
})

export const mutations = {
  setGoodsBasicInfo (state, data) {
    Vue.set(state, 'goodsBasicInfo', data)
  },
  setSpecialGoods (state, data) {
    Vue.set(state, 'specialGoods', data)
  },
  setPromotionInfo (state, data) {
    Vue.set(state, 'promotionInfo', data)
  }
}
export const actions = {
  getGoodsBasicInfo ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      GoodsBasicService.getGoodsBasicInfo(queryCondition)
      .then((res) => {
        commit('setGoodsBasicInfo', res.data)
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  checkIsSaleArea ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      GoodsBasicService.inSaleArea(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  specialGoods ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      GoodsBasicService.getSpecialGoods(queryCondition)
      .then((res) => {
        commit('setSpecialGoods', res.data)
        resolve(res.data.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  relatedCategory ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      GoodsBasicService.getRelatedCategoryByCode(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getGoodsFreight ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      GoodsBasicService.getGoodsFreight(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getPromotionInfo ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      GoodsBasicService.getPromotionInfo(queryCondition)
      .then((res) => {
        commit('setPromotionInfo', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
