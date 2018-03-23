import Vue from 'vue'
import moment from 'moment'
import OrderService from '../services/order-service'

export const state = () => ({
  orderList: {},
  buyList: [{
    goodsId: 4379079202021376,
    goodsQuantity: 2
    // IsActivity: ''
  }, {
    goodsId: 4379082624573440,
    goodsQuantity: 1
  }],
  orderInfo: {},
  orderSn: '',
  searchBarState: false,
  afterCreateOrder: {},
  orderDetail: {}
})

export const mutations = {
  setOrder (state, data) {
    data.itemList.forEach((item) => {
      item.order.forEach((order) => {
        if (order.isPresale) {
          order.presaleTime = moment(order.presaleTime).format('MM月DD日')
        }
      })
    })
    Vue.set(state, 'orderList', Object.assign({}, data))
  },
  setBuyList (state, data) {
    Vue.set(state, 'buyList', data.map(item => Object.assign({}, item)))
  },
  setOrderInfo (state, data) {
    Vue.set(state, 'orderInfo', Object.assign({}, data))
  },
  setOrderDetail (state, data) {
    Vue.set(state, 'orderDetail', Object.assign({}, data))
  },
  setOrderSn (state, data) {
    Vue.set(state, 'orderSn', data)
  },
  setShowSearchBarState (state, data) {
    Vue.set(state, 'searchBarState', data)
  },
  setAfterCreateInfo (state, data) {
    Vue.set(state, 'afterCreateOrder', Object.assign({}, data))
  },
  setGoodsCache (state, data) {
    localStorage.setItem(data.key, JSON.stringify(data.goods))
  },
  removeGoodsCache (state, data) {
    localStorage.removeItem(data)
    const temp = JSON.parse(localStorage.getItem('goodsIdCache'))
    if (temp && temp !== 'null' && temp.indexOf(data) > -1) {
      temp.splice(temp.indexOf(data), 1)
    }
    localStorage.setItem('goodsIdCache', JSON.stringify(temp))
  },
  setGoodsIdCache (state, data) {
    const temp = JSON.parse(localStorage.getItem('goodsIdCache'))
    if (temp && temp !== 'null') {
      temp.push(data)
      localStorage.setItem('goodsIdCache', JSON.stringify(temp))
    } else {
      localStorage.setItem('goodsIdCache', JSON.stringify([data]))
    }
  }
}
export const actions = {
  getOrder ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.getOrder(queryCondition)
      .then((res) => {
        commit('setOrder', res.data)
        resolve(res.data)
      }).catch((err) => {
        console.log('err:', err)
        commit('setOrder', { itemList: [] })
        // 如果错误需要在页面上做处理那么就reject，不需要此处catch就ok，不需要在把错误抛出
        // reject(err)
      })
    })
  },

  clearGoods ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.clearGoods(queryCondition)
      .then((res) => {
        // commit('setAfterCreateInfo', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  deleteOrder ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.deleteOrder(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  confirmPayment ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.confirmPayment(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  beforeCreate ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.beforeCreate(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  confirmPosPayment ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.confirmPosPayment(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getOrderDetail ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.getOrderDetail(queryCondition)
      .then((res) => {
        commit('setOrderDetail', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  confirmReceipt ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.confirmReceipt(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  createOrder ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.createOrder(queryCondition)
      .then((res) => {
        commit('setOrderSn', queryCondition.Sn)
        resolve(res.data)
        // } else {
        //   reject(res)
        // }
      }).catch((err) => {
        reject(err)
      })
    })
  },

  cancelOrder ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.cancelOrder(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  cancelChildOrder ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.cancelChildOrder(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getPayInfo ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.getPayInfo(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  payOrder ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.payOrder(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getOrderFreight ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.getOrderFreight(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },

  getPayResult ({ commit }, queryCondition) {
    return new Promise((resolve, reject) => {
      OrderService.getPayResult(queryCondition)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }

}
