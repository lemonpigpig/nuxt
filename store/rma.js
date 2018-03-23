import Vue from 'vue'
import { cloneDeep } from 'lodash'
import rmaService from '../services/rma-service'

export const state = () => ({
  rmaList: [],
  rmaDetail: {},
  preRmaDetail: {}
})

export const mutations = {
  setRmaList (state, data) {
    if (data && data.itemList) {
      Vue.set(state, 'rmaList', data.itemList.map(item => Object.assign({}, item)))
    } else {
      Vue.set(state, 'rmaList', [])
    }
  },
  setRmaDetail (state, data) {
    Vue.set(state, 'rmaDetail', cloneDeep(data))
  },
  setPreRmaDetail (state, data) {
    Vue.set(state, 'preRmaDetail', data)
  }
}
export const actions = {
  getPreRmaDetail ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      rmaService.getPreRmaApplyDetail(queryCondition)
      .then((res) => {
        commit('setPreRmaDetail', res.data)
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getRmaList ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      rmaService.getRmaList(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getRefundReason ({ commit }) {
    return new Promise((resolve, reject) => {
      rmaService.getRefundReason()
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getShippingList ({ commit }) {
    return new Promise((resolve, reject) => {
      rmaService.getShippingList()
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  submitRefundShipping ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      rmaService.submitRefundShipping(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  editRefund ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      rmaService.editRefund(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  getRmaDetail ({ commit }, id) {
    return new Promise((resolve, reject) => {
      rmaService.getRmaDetail(id)
        .then((res) => {
          if (res.data) {
            commit('setRmaDetail', res.data)
            resolve(res.data)
          } else {
            resolve([])
          }
        }).catch((err) => {
          reject(err)
        })
    })
  },
  submitRefund ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      rmaService.submitRefund(queryCondition)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  cancelRmaApply ({ commit }, id) {
    return new Promise((resolve, reject) => {
      rmaService.cancelRmaApply(id)
        .then((res) => {
          resolve(res.data)
        }).catch((err) => {
          reject(err.data)
        })
    })
  }
}
