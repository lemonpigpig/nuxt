import Vue from 'vue'

const submitAdvise = queryCondition => Vue.axios.post('/feedback', queryCondition)
const noticeList = queryCondition => Vue.axios.post('/cms/search', queryCondition)
const getNewsDetial = id => Vue.axios.get(`/cms/${id}`)
const getFavoritesList = () => Vue.axios.get('/users/favorites')
const getCouponList = () => Vue.axios.get('/users/coupons')
const collectDeleteSingle = goodsId => Vue.axios.delete(`/goods/favorite/deleteByGoodsId/${goodsId}`)
const deleteFavouritesAll = queryCondition => Vue.axios.put('/goods/favorite/delete', queryCondition)
const modifyPassword = passwordInfo => Vue.axios.post('/users/modifyPassword', passwordInfo)

export default {
  submitAdvise,
  noticeList,
  getFavoritesList,
  getNewsDetial,
  collectDeleteSingle,
  deleteFavouritesAll,
  modifyPassword,
  getCouponList
}
