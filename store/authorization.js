import Vue from 'vue'
import authorizationService from '../services/authorization-service' // eslint-disable-line

export const state = () => ({
  floorList: [],
  userAuth: '',
  imgVerifyData: {},
  userName: '',
  phone: '',
  sessionId: '',
  setForgetPwdStep1Sussces: false,
  setForgetPwdStep2Sussces: false
})

export const mutations = {
  setFloor (state, data) {
    Vue.set(state, 'floorList', data.map(item => Object.assign({}, item)))
  },
  setUserAuth (state, data) {
    Vue.set(state, 'userAuth', data)
  },
  SignUpSuccess (state, { userName, sessionId, phone }) {
    Vue.set(state, 'userName', userName)
    Vue.set(state, 'sessionId', sessionId)
    Vue.set(state, 'phone', phone)
  },
  SignInSuccess (state, data) {
    // donot delete
    localStorage.setItem('sessionId', data)
    Vue.set(state, 'sessionId', data)
  },
  SYNC_SESSION (state, { userName, sessionId, phone }) {
    Vue.set(state, 'userName', userName)
    Vue.set(state, 'sessionId', sessionId)
    Vue.set(state, 'phone', phone)
  },
  setUserInfo (state, data) {
    Vue.set(state, 'userName', data.userName)
    Vue.set(state, 'phone', data.phone)
  },
  setImgVerifyData (state, data) {
    Vue.set(state, 'imgVerifyData', Object.assign({}, data))
  },
  SignOut (state) {
    Vue.set(state, 'userName', null)
    Vue.set(state, 'sessionId', null)
    Vue.set(state, 'phone', null)
  },
  verifyForgetPwdStep1 (state, data) {
    Vue.set(state, 'setForgetPwdStep1Sussces', data)
  },
  forgetPwdStep2Sussces (state, data) {
    Vue.set(state, 'setForgetPwdStep2Sussces', data)
  }
}

export const actions = {
  syncSession ({ commit }) {
    if (!process.SERVER_BUILD) {
      const userName = global.localStorage.getItem('userName')
      const sessionId = global.localStorage.getItem('sessionId')
      const phone = global.localStorage.getItem('phone')
      commit('SYNC_SESSION', {
        userName,
        sessionId,
        phone
      })
    }
  },
  sendVerifyCode ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      authorizationService.sendVerifyCode(queryCondition)
      .then((res) => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getImgVerify ({ commit }) {
    return new Promise((resolve, reject) => {
      authorizationService.imgVerify()
      .then((res) => {
        commit('setImgVerifyData', res.data)
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  phoneExisted ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      authorizationService.phoneExisted(queryCondition)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  userNameExisted ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      authorizationService.userNameExisted(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  signUp ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      authorizationService.signUp(queryCondition)
      .then((res) => {
        commit('SignUpSuccess', Object.assign({}, res.data.sessionId, queryCondition.userName, queryCondition.phone))
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  signIn ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      authorizationService.signIn(queryCondition)
      .then((res) => {
        if (global.hasOwnProperty('localStorage')) {
          localStorage.setItem('sessionId', res.data.sessionId)
        }
        commit('SignInSuccess', res.data.sessionId)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  signOut ({ commit }) {
    return new Promise((resolve, reject) => {
      authorizationService.signOut()
      .then((res) => {
        global.localStorage.removeItem('userName')
        global.localStorage.removeItem('sessionId')
        global.localStorage.removeItem('phone')
        global.localStorage.removeItem('gz-cart')
        commit('SignOut', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getProfile ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      authorizationService.getProfile(queryCondition)
      .then((res) => {
        commit('setUserInfo', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  verifyForgetPwdStep1 ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      authorizationService.verifyForgetPwdStep1(queryCondition)
        .then((res) => {
          commit('verifyForgetPwdStep1', true)
          resolve(res.data)
        }).catch((err) => {
          commit('verifyForgetPwdStep1', false)
          reject(err)
        })
    })
  }
  // forgetPwdStep2Sussces ({ commit }, queryCondition) {
  //   return new Promise((resolve, reject) => {
  //     console.log(queryCondition)
  //     authorizationService.verifyForgetPwdStep1(queryCondition)
  //       .then((res) => {
  //         commit('setForgetPwdStep2Sussces', true)
  //       }).catch(() => {
  //         commit('setForgetPwdStep2Sussces', false)
  //       })
  //   })
  // }
}
