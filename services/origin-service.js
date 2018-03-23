import Vue from 'vue'

const getOriginProductsList = queryCondition => Vue.axios.post('/goods/origin', queryCondition)

export default {
  getOriginProductsList
}
