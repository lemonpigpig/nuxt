import Vue from 'vue'
import _ from 'lodash'
import CartService from '../services/cart-service'
import BizConst from '~/biz/const'

let isLogin = false
if (!process.SERVER_BUILD) {
  isLogin = localStorage.getItem('sessionId') && localStorage.getItem('sessionId') !== 'undefined'
}

function getGoodsPriceChangedMsg (cartList) {
  let msg = ''
  if (cartList && cartList.length > 0 && cartList !== 'undefined') {
    cartList.forEach((current) => {
      if (current.priceChangeRemark) {
        msg = current.priceChangeRemark
      }
    })
  }
  return msg
}

function getGoodsTotalPrice (quantity, price) {
  return parseFloat(quantity * price).toFixed(2)
}

function updateLocalStorage (cart) {
  if (process.BROWSER_BUILD) {
    const filterCart = cart.filter(item => item.itemType === 1).map(it => _.pick(it, ['goodsId', 'goodsQuantity', 'isSelected', 'itemType']))
    localStorage.setItem('gz-cart', JSON.stringify(filterCart || []))
  }
}

function getCartCheckedDetails (cartList) {
  let checkedIds = []
  let canChecked = []
  let checkedAll = false
  cartList.forEach((item) => {
    if (item.itemType === BizConst.ITEM_TYPE_NORMAL && (item.status === BizConst.GOODS_STATUS_FOR_SALE && item.stock >= 1)) {
      canChecked.push(item.goodsId)
      if (item.isSelected) {
        checkedIds.push(item.goodsId)
      }
    }
  })
  if (canChecked.length > 0 && canChecked.length === checkedIds.length) {
    checkedAll = true
  }
  return { checkedIds: checkedIds, checkedAll: checkedAll }
  // return cartList.filter(item => item.isSelected && item.itemType === BizConst.ITEM_TYPE_NORMAL && item.goodsLimit > 0 && item.goodsLimit >= item.goodsQuantity).map(item => item.goodsId)
}
function getCheckedGoods (goods) {
  const cart = []
  goods.forEach(data =>
    cart.push({
      GoodsId: data.productId || data.goodsId || data.id,
      Quantity: data.productQuantity || data.goodsQuantity,
      ItemType: data.itemType || 1,
      IsSelected: data.isSelected
    })
  )
  return cart
}
function fetchLocalCart () {
  return (localStorage.getItem('gz-cart') && JSON.parse(localStorage.getItem('gz-cart'))) || []
}

export const state = () => ({
  cart: [],
  selectedCartSize: 0,
  showLength: 4,
  checkedAll: false,
  checkedIds: [],
  promotionList: [],
  cartTotalInfo: {}
})

export const getters = {
  cartSize (state) {
    if (state.cart) {
      return state.cart.filter(item => item.itemType === 1).reduce((sum, item) => (
        Number.parseInt(item.goodsQuantity, 10) + sum
      ), 0)
    }
    return 0
  },
  totalPrice (state) {
    if (state.cart) {
      let price = state.cart.reduce((total, item) => (
        total + parseFloat(item.computedPrice) * Number.parseInt(item.goodsQuantity, 10)
      ), 0)
      return price.toFixed(2)
    }
    return '0.00'
  },
  promotionList (state) {
    return state.promotionList
  },
  goodsNotInPromotion (state) {
    let goodsIDsInPromotion = []// 满足促销活动的商品ID列表
    let goodsNotInPromotion = []// 非活动商品
    if (state.promotionList && state.promotionList.length > 0) {
      state.promotionList.forEach(item => {
        if (item.promotionItemList && item.promotionItemList.length > 0) {
          item.promotionItemList.forEach(goods => {
            if (goods.itemType === BizConst.ITEM_TYPE_NORMAL) {
              goodsIDsInPromotion.push(goods.goodsId)
            }
          })
        }
      })
    }
    const allGoodsIDs = state.cart// 购物车中所有商品ID列表
      .filter(item => item.itemType === BizConst.ITEM_TYPE_NORMAL && item.status === BizConst.GOODS_STATUS_FOR_SALE && item.goodsLimit > 0)
      .map(item => item.goodsId)
    const goodsIDsNotInPromotion = _.difference(allGoodsIDs, goodsIDsInPromotion) // 不参加促销活动的商品ID列表
    goodsNotInPromotion = state.cart.filter(item => goodsIDsNotInPromotion.indexOf(item.goodsId) > -1 && item.itemType === BizConst.ITEM_TYPE_NORMAL)
        .map(item => Object.assign({}, item, {checked: false, goodsTotalPrice: getGoodsTotalPrice(item.goodsQuantity, item.computedPrice)}))
    console.log('goodsNotInPromotion', goodsNotInPromotion)
    return goodsNotInPromotion
  },
  invalidCartList (state) {
    if (state.cart && state.cart.length > 0) {
      return state.cart
              .filter(item => item.itemType === BizConst.ITEM_TYPE_NORMAL && (item.status !== BizConst.GOODS_STATUS_FOR_SALE || item.goodsLimit < 1))
              .map(item => Object.assign({}, item, {checked: false, goodsTotalPrice: getGoodsTotalPrice(item.goodsQuantity, item.computedPrice)}))
    }
    return []
  },
  getCartTotalInfo (state) {
    return state.cartTotalInfo
  },
  getCartList (state) {
    return state.cart
  }
}

export const mutations = {
  updateCheckedAll (state, status) {
    Vue.set(state, 'checkedAll', status)
  },
  updateCheckedIds (state, checkedIds) {
    Vue.set(state, 'checkedIds', checkedIds)
  },
  updateCart (state, cart) {
    Vue.set(state, 'cart', cart)
  },
  updatePromotion (state, promotion) {
    Vue.set(state, 'promotionList', promotion)
  },
  updateViewModel (state, {cartList, promotionList}) {
    if (cartList) {
      Vue.set(state, 'cart', cartList)
    }
    if (promotionList) {
      Vue.set(state, 'promotionList', promotionList)
    }
  },
  updateRuleCancel (context, {id, lowestRuleId}) {
    const index = context.getters.promotionList.findIndex(item => item.promotionId === id)
    Vue.set(context.state.promotionList[index], 'ruleId', lowestRuleId)
  },
  setCartTotalInfo (state, { cartTotalInfo }) {
    Vue.set(state, 'cartTotalInfo', cartTotalInfo)
  }
}
export const actions = {
  getMergedCart (context, cart = []) {
    if (localStorage.getItem('sessionId')) {
      return new Promise((resolve, reject) => {
        CartService.getCartInfo(cart)
          .then(({cartList, promotionList, cartTotalInfo}) => {
            if (cartList) {
              const checkedDetails = getCartCheckedDetails(cartList)
              context.commit('updateCheckedIds', checkedDetails.checkedIds)
              context.commit('updateCheckedAll', checkedDetails.checkedAll)
              context.commit('updateViewModel', {cartList, promotionList})
              context.commit('setCartTotalInfo', { cartTotalInfo })
              const msg = getGoodsPriceChangedMsg(cartList)
              if (msg) {
                resolve(msg)
              }
              resolve(cartList)
            }
          }).catch((err) => {
            reject(err)
          })
      })
    }
    const localCart = fetchLocalCart()
    context.dispatch('updateLocalCart', localCart)
  },
  clearCart (context, data) {
    if (localStorage.getItem('sessionId')) {
      return new Promise((resolve, reject) => {
        CartService.clearCart(data)
          .then(({cartList, promotionList, cartTotalInfo}) => {
            if (cartList) {
              const checkedDetails = getCartCheckedDetails(cartList)
              context.commit('updateCheckedIds', checkedDetails.checkedIds)
              context.commit('updateCheckedAll', checkedDetails.checkedAll)
              context.commit('updateCart', cartList)
              context.commit('setCartTotalInfo', { cartTotalInfo })
              context.commit('updateViewModel', {cartList, promotionList})
            }
            resolve(cartList)
          }).catch((err) => {
            reject(err)
          })
      })
    } else {
      const localCart = fetchLocalCart()
      data.forEach((id) => {
        const index = _.findIndex(localCart, it => it.goodsId === id)
        if (index !== -1) {
          localCart.splice(index, 1)
        }
      })
      context.dispatch('updateLocalCart', localCart)
      return Promise.resolve()
    }
  },
  addGoodsQuantity (context, item) {
    const goodsQuantity = item.goodsQuantity || item.quantity
    if (localStorage.getItem('sessionId')) {
      return new Promise((resolve, reject) => {
        CartService.addGoodsQuantity({ goodsId: item.goodsId, quantity: goodsQuantity })
          .then(({cartList, promotionList, cartTotalInfo}) => {
            if (cartList) {
              const checkedDetails = getCartCheckedDetails(cartList)
              context.commit('updateCheckedIds', checkedDetails.checkedIds)
              context.commit('updateCheckedAll', checkedDetails.checkedAll)
              context.commit('setCartTotalInfo', { cartTotalInfo })
              const msg = getGoodsPriceChangedMsg(cartList)
              if (msg) {
                reject(msg)
              }
            }
            context.commit('updateViewModel', {cartList, promotionList})
            resolve()
          }).catch((err) => {
            reject(err)
          })
      })
    } else {
      if (!item.goodsImage && item.imageCover) {
        item.goodsImage = item.imageCover
      }
      const localCart = fetchLocalCart()
      const goodItem = _.find(localCart, it => it.goodsId === item.goodsId)
      if (goodItem) {
        goodItem.isSelected = true
        goodItem.goodsQuantity += goodsQuantity
      } else {
        localCart.push(item)
      }
      context.dispatch('updateLocalCart', localCart)
      return Promise.resolve()
    }
  },
  reduceGoodsQuantity (context, item) {
    const goodsQuantity = item.goodsQuantity || item.quantity
    if (localStorage.getItem('sessionId')) {
      return new Promise((resolve, reject) => {
        CartService.reduceGoodsQuantity({ goodsId: item.goodsId, quantity: goodsQuantity })
        .then(({cartList, promotionList, cartTotalInfo}) => {
          if (cartList) {
            const checkedDetails = getCartCheckedDetails(cartList)
            context.commit('updateCheckedIds', checkedDetails.checkedIds)
            context.commit('updateCheckedAll', checkedDetails.checkedAll)
          }
          context.commit('setCartTotalInfo', { cartTotalInfo })
          const msg = getGoodsPriceChangedMsg(cartList)
          if (msg) {
            reject(msg)
          }
          context.commit('updateViewModel', {cartList, promotionList})
          resolve(cartList)
        }).catch((err) => {
          reject(err)
        })
      })
    } else {
      const localCart = fetchLocalCart()
      const goodItem = _.find(localCart, it => it.goodsId === item.goodsId)
      if (goodItem) {
        goodItem.isSelected = true
        goodItem.goodsQuantity -= goodsQuantity
      }
      context.dispatch('updateLocalCart', localCart)
      return Promise.resolve()
    }
  },
  updateGoodsQuantity (context, item) {
    const goodsQuantity = item.goodsQuantity || item.quantity
    if (localStorage.getItem('sessionId')) {
      return new Promise((resolve, reject) => {
        CartService.updateGoodsQuantity({ goodsId: item.goodsId, quantity: goodsQuantity })
          .then(({cartList, promotionList, cartTotalInfo}) => {
            if (cartList) {
              const checkedDetails = getCartCheckedDetails(cartList)
              context.commit('updateCheckedIds', checkedDetails.checkedIds)
              context.commit('updateCheckedAll', checkedDetails.checkedAll)
              context.commit('setCartTotalInfo', { cartTotalInfo })
              const msg = getGoodsPriceChangedMsg(cartList)
              if (msg) {
                reject(msg)
              }
            }
            context.commit('updateViewModel', {cartList, promotionList})
            resolve(cartList)
          }).catch((err) => {
            reject(err)
          })
      })
    }
    const localCart = fetchLocalCart()
    const goodItem = _.find(localCart, it => it.goodsId === item.goodsId)
    if (goodItem) {
      goodItem.isSelected = true
      goodItem.goodsQuantity = goodsQuantity
    }
    context.dispatch('updateLocalCart', localCart)
    return Promise.resolve()
  },
  selectGoods (context, goodsId) {
    if (localStorage.getItem('sessionId')) {
      return new Promise((resolve, reject) => {
        CartService.updateCartGoodsSelect(goodsId)
          .then(({cartList, promotionList, cartTotalInfo}) => {
            if (cartList) {
              const checkedDetails = getCartCheckedDetails(cartList)
              context.commit('updateCheckedIds', checkedDetails.checkedIds)
              context.commit('updateCheckedAll', checkedDetails.checkedAll)
              context.commit('setCartTotalInfo', { cartTotalInfo })
              const msg = getGoodsPriceChangedMsg(cartList)
              if (msg) {
                reject(msg)
              }
            }
            context.commit('updateViewModel', {cartList, promotionList})
            resolve({cartList, promotionList})
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
    const localCart = fetchLocalCart()
    goodsId.forEach((id) => {
      const goodItem = _.find(localCart, it => it.goodsId === id)
      if (goodItem) {
        goodItem.isSelected = true
      }
    })
    context.dispatch('updateLocalCart', localCart)
    return Promise.resolve()
  },
  cancelGoods (context, goodsId) {
    if (isLogin) {
      return new Promise((resolve, reject) => {
        CartService.updateCartGoodsCancel(goodsId)
          .then(({cartList, promotionList, cartTotalInfo}) => {
            if (cartList) {
              const checkedDetails = getCartCheckedDetails(cartList)
              context.commit('updateCheckedIds', checkedDetails.checkedIds)
              context.commit('updateCheckedAll', checkedDetails.checkedAll)
              context.commit('setCartTotalInfo', { cartTotalInfo })
              const msg = getGoodsPriceChangedMsg(cartList)
              if (msg) {
                reject(msg)
              }
            }
            context.commit('updateViewModel', {cartList, promotionList})
            resolve({cartList, promotionList})
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
    const localCart = fetchLocalCart()
    goodsId.forEach((id) => {
      const goodItem = _.find(localCart, it => it.goodsId === id)
      if (goodItem) {
        goodItem.isSelected = false
      }
    })
    context.dispatch('updateLocalCart', localCart)
    return Promise.resolve()
  },
  updateLocalCart (context, updatedGoods) {
    const goods = getCheckedGoods(updatedGoods)
    return new Promise((resolve, reject) => {
      CartService.updateLocalCart(goods)
      .then(({cartList, promotionList, cartTotalInfo}) => {
        if (cartList) {
          const checkedDetails = getCartCheckedDetails(cartList)
          context.commit('updateCheckedIds', checkedDetails.checkedIds)
          context.commit('updateCheckedAll', checkedDetails.checkedAll)
          context.commit('setCartTotalInfo', { cartTotalInfo })
          if (!localStorage.getItem('sessionId')) {
            updateLocalStorage(cartList)
          }
          const msg = getGoodsPriceChangedMsg(cartList)
          if (msg) {
            reject(msg)
          }
        }
        context.commit('updateViewModel', {cartList, promotionList})
        resolve({cartList, promotionList})
      })
      .catch((err) => {
        reject(err)
      })
    })
  }
}
