import Vue from 'vue'

import GoodsService from '../services/goods-service'

export const state = () => ({
  recommendGoods: []
})

export const mutations = {
  setRecommendGoods (state, data) {
    Vue.set(state, 'recommendGoods', data)
  }
}

export const actions = {
  async getRecommendGoods ({ commit }, {pageTypeKey, positionKey}) {
    try {
      const goods = await GoodsService.getRecommendGoods({pageTypeKey, positionKey})
      goods.forEach(g => delete g.id)
      commit('setRecommendGoods', goods)
    } catch (e) {
      throw e
    }
  }
}
