import Vue from 'vue'
import BizConst from '~/biz/const'
import _ from 'lodash'

const ruleShowType = {1: '满减', 2: '满赠', 3: '满减满赠'}

function map2GoodsListModel ({ sourceGoodsList, promotionId, lowestRuleId }) {
  let targetGoodsList = []
  const preNormalGoodsList = _.cloneDeep(sourceGoodsList)
  if (sourceGoodsList) {
    const normalList = preNormalGoodsList.filter(item => item.itemType !== BizConst.ITEM_TYPE_GIFT)
    sourceGoodsList.forEach(item => {
      let promotionGoodsObj = {}
      promotionGoodsObj.promotionId = promotionId
      promotionGoodsObj.promotionInfo = {
        goodsLen: normalList.length,
        lowestRuleId: lowestRuleId
      }
      promotionGoodsObj.goodsId = item.goodsId
      promotionGoodsObj.goodsImage = item.goodsImage
      promotionGoodsObj.goodsName = item.goodsName
      promotionGoodsObj.goodsLimit = item.goodsLimit
      promotionGoodsObj.tag = item.tag
      promotionGoodsObj.itemType = item.itemType
      promotionGoodsObj.isSelected = item.isSelected
      promotionGoodsObj.computedPrice = item.computedPrice
      promotionGoodsObj.dicountSharePrice = item.currentPrice
      promotionGoodsObj.goodsOriginalPrice = item.goodsOriginalPrice
      promotionGoodsObj.stock = item.goodsLimit
      promotionGoodsObj.minLimit = item.minLimit
      promotionGoodsObj.increment = item.increment
      promotionGoodsObj.goodsQuantity = item.goodsQuantity
      promotionGoodsObj.status = item.goodsStatus
      promotionGoodsObj.introduction = item.introduction
      promotionGoodsObj.remainingTime = item.remainingTime
      promotionGoodsObj.priceChangeRemark = item.priceChangeRemark
      promotionGoodsObj.quantityChangeRemark = item.quantityChangeRemark
      promotionGoodsObj.isPresale = item.isPresale
      promotionGoodsObj.presaleTime = item.presaleTime
      promotionGoodsObj.isTraceSource = item.isTraceSource
      promotionGoodsObj.isAbholung = item.isAbholung
      promotionGoodsObj.goodsTotalPrice = (promotionGoodsObj.computedPrice * promotionGoodsObj.goodsQuantity).toFixed(2)
      targetGoodsList.push(promotionGoodsObj)
    })
  }
  return targetGoodsList
}

function map2RuleListModel (ruleList) {
  let promotionRules = []
  if (ruleList) {
    ruleList.forEach(item => {
      let promotionRuleObj = {}
      promotionRuleObj.id = item.ruleId
      promotionRuleObj.type = item.type
      promotionRuleObj.threshold = item.amountLimit
      promotionRuleObj.reduceAmount = item.reduceAmount
      promotionRuleObj.giftList = map2GoodsListModel({ sourceGoodsList: item.promotionItemResponse })
      promotionRules.push(promotionRuleObj)
    })
  }
  return promotionRules
}

function map2PromotionListModel (promotionList) {
  const promotionListModel = []
  promotionList.forEach(promotion => {
    let promotionObj = {}
    promotionObj.ruleId = promotion.ruleId
    promotionObj.promotionId = promotion.promotionId
    promotionObj.ruleType = promotion.ruleShowType// 用来判断石否为 满减 满赠 满减满赠
    promotionObj.ruleName = ruleShowType[promotion.ruleShowType]// 前端界面活动显示 满减 满赠 满减满赠
    promotionObj.isApplyed = promotion.isApplyed
    promotionObj.isTopestRule = promotion.isTopestRule
    promotionObj.promotionType = promotion.promotionType

    if (promotion.promotionRuleItemResponse) {
      promotionObj.ruleListLen = promotion.promotionRuleItemResponse.length
      if (promotion.promotionRuleItemResponse.length > 0) {
        promotionObj.promotionItemList = map2GoodsListModel({lowestRuleId: promotion.promotionRuleItemResponse.sort(p => p.AmountLimit)[0].ruleId, sourceGoodsList: promotion.promotionItemResponse, promotionId: promotion.promotionId})
        promotionObj.promotionRuleList = map2RuleListModel(promotion.promotionRuleItemResponse.sort(r => r.amountLimit))
        if (promotionObj.promotionRuleList && promotionObj.promotionRuleList.length > 0) {
          promotionObj.lowestRule = promotionObj.promotionRuleList[0]
        }
        if (promotion.isApplyed) {
          const appliedRule = getAppliedPromotion(promotion.ruleId, promotionObj.promotionRuleList)
          if (appliedRule) {
            promotionObj.appliedRule = appliedRule
            promotionObj.currentThreshold = appliedRule.threshold
            promotionObj.reduceAmount = appliedRule.reduceAmount
            promotionObj.appliedRuleType = appliedRule.type
            const gift = promotionObj.promotionItemList.filter(it => it.itemType === BizConst.ITEM_TYPE_GIFT)
            if (gift && gift.length > 0) {
              promotionObj.appliedRule.giftList = gift
            } else {
              promotionObj.appliedRule.giftList = []
            }
          } else {
            throw new Error('Cannot find applied rule!')
          }
        }
      }
    }
    promotionListModel.push(promotionObj)
  })
  return promotionListModel
}
function map2TotalInfo (data) {
  let totalInfo = {}
  if (data) {
    Vue.set(totalInfo, 'totalPrice', data.totalPrice.toFixed(2))
    Vue.set(totalInfo, 'discountTotalAmount', data.discountTotalAmount.toFixed(2))
  }
  return totalInfo
}

const mapCartResponse2Model = (res) => {
  if (!res) {
    return {
      cartList: [],
      promotionList: [],
      cartTotalInfo: {}
    }
  } else if (!res.code) {
    let cartList = res.data.cartList ? res.data.cartList : []
    let promotionList = res.data.promotionList ? res.data.promotionList : []
    return {
      cartList: map2GoodsListModel({ sourceGoodsList: cartList }),
      promotionList: map2PromotionListModel(promotionList),
      cartTotalInfo: map2TotalInfo(res.data)
    }
  } else {
    throw new Error(`Error, Code: ${res.code}`)
  }
}

function getAppliedPromotion (ruleId, ruleList) {
  const newRuleList = _.cloneDeep(ruleList)
  if (!newRuleList || !ruleId) {
    return null
  }
  const rule = newRuleList.find(rule => rule.id === ruleId)
  return rule
}

const getCartInfo = (data) => Vue.axios.put('/cart/merge', data).then(mapCartResponse2Model)
const reduceGoodsQuantity = ({ goodsId, quantity }) => Vue.axios.put(`/cart/subtract`, { goodsId, quantity }).then(mapCartResponse2Model)
const clearCart = data => Vue.axios.put(`/cart/clear`, data).then(mapCartResponse2Model)
const addGoodsQuantity = ({ goodsId, quantity, ItemType }) => Vue.axios.put(`/cart/add`, { goodsId, quantity, ItemType }).then(mapCartResponse2Model)
const updateGoodsQuantity = ({ goodsId, quantity }) => Vue.axios.put(`/cart/update`, { goodsId, quantity }).then(mapCartResponse2Model)
const updateCartGoodsCancel = (goodsIds) => Vue.axios.put(`/cart/cancel`, goodsIds).then(mapCartResponse2Model)
const updateCartGoodsSelect = (goodsId) => Vue.axios.put(`/cart/select`, goodsId).then(mapCartResponse2Model)
const updateLocalCart = (goods) => Vue.axios.put(`/cart/local`, goods).then(mapCartResponse2Model)
export default {
  getCartInfo,
  reduceGoodsQuantity,
  clearCart,
  addGoodsQuantity,
  updateGoodsQuantity,
  updateCartGoodsCancel,
  updateCartGoodsSelect,
  updateLocalCart
}
