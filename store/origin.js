import Vue from 'vue'
import originService from '../services/origin-service'

export const state = () => ({
  originProductList: {
    banner: [{imgs: ''}]
  }
})

export const mutations = {
  setOriginProductlist (state, data) {
    Vue.set(state, 'originProductList', Object.assign({}, data))
  }
}
export const actions = {
  getOriginProductsList ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      originService.getOriginProductsList(queryCondition)
        .then((res) => {
          console.log(res)
          commit('setOriginProductlist', res.data)
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  }
}
