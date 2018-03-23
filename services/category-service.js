import Vue from 'vue'

const getCategoryList = queryCondition => Vue.axios.post('/goods', queryCondition) // 获取商品列表
const getCategoryLocation = id => Vue.axios.get(`/goods/category/${id}/ancestors`)
const getCategorySpecial = id => Vue.axios.get(`/goods/special?categoryCode=${id}`)
const getCategorySearchCondition = queryCondition => Vue.axios.post('/goods/searchcondition', queryCondition)

export default {
  getCategoryList,
  getCategoryLocation,
  getCategorySpecial,
  getCategorySearchCondition
}
