// import Vue from 'vue'

import KeywordsService from '../services/keywords-service'

export const state = () => ({
})

export const mutations = {
}

export const actions = {
  isSensitive ({ commit }, { KeyWords }) {
    return new Promise((resolve, reject) => {
      KeywordsService.isSensitive({ KeyWords })
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
