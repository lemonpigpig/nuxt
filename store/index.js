import Vue from 'vue'
export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}
export const actions = {
  async nuxtServerInit ({ commit }, { req }) {
    try {
      const categoriesRes = await Vue.axios.get(`/helpcenter/pages/categorys`)
      commit('help-center/setCategoryList', categoriesRes.data)
    } catch (e) {
      throw e
    }
  }
}
