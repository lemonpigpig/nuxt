import Vue from 'vue'
import AddressService from '../services/address-service'

export const state = () => ({
  addressList: [],
  index: 0
})

export const mutations = {
  setAddress (state, data) {
    Vue.set(state, 'addressList', data.map(item => Object.assign({}, item)))
  },
  saveAdressIndex (state, data) {
    Vue.set(state, 'index', data)
  }
}
export const actions = {
  getAddressList ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      AddressService.getAddressList(queryCondition)
      .then((res) => {
        commit('setAddress', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  createAddress ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      AddressService.createAddress(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  editAddress ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      AddressService.editAddress(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getAddressInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      AddressService.getAddress()
      .then((res) => {
        commit('setAddressInfo', res.data.data)
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  setDefaultAddress ({ commit }, id) {
    return new Promise((resolve, reject) => {
      AddressService.setDefaultAddress(id)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err.data)
      })
    })
  },
  saveSelectedIndex ({ commit }, index) {
    if (index) {
      commit('saveAdressIndex', index)
    }
  },
  getAddressBasicData ({ commit }, id) {
    return new Promise((resolve, reject) => {
      AddressService.getAddressBasicData(id)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  deleteAddress ({ commit }, id) {
    return new Promise((resolve, reject) => {
      AddressService.deleteAddress(id)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
