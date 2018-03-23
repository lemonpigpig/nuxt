import Vue from 'vue'

const getFloor = queryCondition => Vue.axios.post('/floors/pages', queryCondition)
const getFirstLevelArea = () => Vue.axios.get('/common/address/0')
const getLevelAreaByCode = queryCondition => Vue.axios.get(`/common/address/${queryCondition.code}`)
const getHotKewards = () => Vue.axios.get('/goods/searchRecommend')
const getHotKewardsByPosition = queryCondition => Vue.axios.post('/KeyWords/hot', queryCondition)
const getCategory = () => Vue.axios.get('/goods/category')
const getBanner = queryCondition => Vue.axios.post('/banner', queryCondition)
const getPageTypeIdByKey = id => Vue.axios.get(`/cms/pagetype/${id}`)
const getDefaultKeywords = queryCondition => Vue.axios.post('/KeyWords', queryCondition)
const getSeoKeywords = queryCondition => Vue.axios.post('/KeyWords/seo', queryCondition)
const getTopic = queryCondition => Vue.axios.post('/cms/topic/search', queryCondition)
const getUpload = () => Vue.axios.get('/common/upload-path')

export default {
  getFloor,
  getFirstLevelArea,
  getLevelAreaByCode,
  getHotKewards,
  getHotKewardsByPosition,
  getCategory,
  getBanner,
  getPageTypeIdByKey,
  getDefaultKeywords,
  getSeoKeywords,
  getTopic,
  getUpload
}
