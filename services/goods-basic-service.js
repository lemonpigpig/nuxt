import Vue from 'vue'

const getGoodsBasicInfo = queryCondition => Vue.axios.get(`/goods/${queryCondition}`)
const inSaleArea = queryCondition => Vue.axios.get(`/goods/${queryCondition.id}/InSalesArea?provinceCode=${queryCondition.provinceCode}&cityCode=${queryCondition.cityCode}`)
const getSpecialGoods = queryCondition => Vue.axios.get(`/goods/special?categoryCode=${queryCondition}`)
const getRelatedCategoryByCode = queryCondition => Vue.axios.get(`/goods/category/${queryCondition}/related`)
const getGoodsFreight = queryCondition => Vue.axios.post('/goods/freight', queryCondition)
const getPromotionInfo = id => Vue.axios.get(`/promotion/fullcut/${id}`, id)
// 获取商品优惠券
const getCoupons = () => Vue.axios.get('promotion/coupons')

export default {
  getGoodsBasicInfo,
  inSaleArea,
  getSpecialGoods,
  getRelatedCategoryByCode,
  getGoodsFreight,
  getPromotionInfo,
  getCoupons
}
