import Vue from 'vue'

const getPageDetail = pageId => Vue.axios.get(`/helpcenter/pages/${pageId}`)
const getCategoryList = () => Vue.axios.get(`/helpcenter/pages/categorys`)

export default {
  getPageDetail,
  getCategoryList
}
