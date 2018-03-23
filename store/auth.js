// import Vue from 'vue'
import UserService from '../services/user-service'

export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
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
  login () {
    return new Promise((resolve, reject) => {
      UserService.login({userName: 'jjy', password: '19891119'})
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
