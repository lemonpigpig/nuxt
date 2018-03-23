import Vue from 'vue'

const login = ({ userName, password }) => Vue.axios.post('/baskstageuser/signIn', {
  userName,
  password
})

const getStores = ({ provinceCode, cityCode, districtCode }) => Vue.axios.post('/users/storeaddress', {
  provinceCode,
  cityCode,
  districtCode
})

const getStore = (id) => Vue.axios.get('/users/store/')

const setStore = ({ storeId, name, phone }) => Vue.axios.post('/users/store', {
  storeId, name, phone
})

const updateStore = ({ storeId, name, phone }) => Vue.axios.put('/users/store', {
  storeId, name, phone
})

export default {
  login,
  getStores,
  setStore,
  updateStore,
  getStore
}
