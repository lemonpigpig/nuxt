import Vue from 'vue'

const getPromotionList = queryCondition => Vue.axios.post('/promotion/seckillgoods', queryCondition)
const getCouponsList = () => Vue.axios.get('/promotion/coupons')
const receiveCoupon = queryCondition => Vue.axios.get(`/promotion/receviecoupon?couponId=${queryCondition}`)
const getPoolGoodsBytype = queryCondition => Vue.axios.post('/promotion/goodsPool', queryCondition)
const getCouponsByGoodsId = id => Vue.axios.get(`promotion/coupons/${id}`)

export default {
  getPromotionList,
  getCouponsList,
  receiveCoupon,
  getPoolGoodsBytype,
  getCouponsByGoodsId
}
