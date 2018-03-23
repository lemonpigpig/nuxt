import Vue from 'vue'
const getMuseumsByCode = queryCondition => Vue.axios.get(`/museums/${queryCondition}/district`)
const getHotMuseums = queryCondition => Vue.axios.post('/museums/hot', queryCondition)
const getMuseumDetail = queryCondition => Vue.axios.get(`/museums/${queryCondition}`)
const getMuseumsByCitycode = queryCondition => Vue.axios.post(`/museums/citys/${queryCondition.code}`, queryCondition.body)
const getGoodsByMuseumId = queryCondition => Vue.axios.post(`/museums/${queryCondition.id}/goods`, queryCondition.body)
const getNewMuseums = queryCondition => Vue.axios.post('/museums/new', queryCondition)

export default {
  getMuseumsByCode,
  getHotMuseums,
  getMuseumDetail,
  getMuseumsByCitycode,
  getGoodsByMuseumId,
  getNewMuseums
}
