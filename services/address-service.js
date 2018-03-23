import Vue from 'vue'

const getAddressList = queryCondition => Vue.axios.get('/address')
const createAddress = queryCondition => Vue.axios.post('/address', queryCondition)
const setDefaultAddress = id => Vue.axios.put(`/address/default?id=${id}`)
const getAddressBasicData = () => Vue.axios.get('/common/address/tree')
const deleteAddress = id => Vue.axios.delete(`/address?id=${id}`)
const editAddress = data => Vue.axios.put('/address', data)

export default {
  getAddressList,
  createAddress,
  setDefaultAddress,
  getAddressBasicData,
  deleteAddress,
  editAddress
}
