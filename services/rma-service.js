import Vue from 'vue'

const getRmaList = queryCondition => Vue.axios.post('/rma/search', queryCondition)
const getPreRmaApplyDetail = queryCondition => Vue.axios.post('/rma/preview', queryCondition)
const getRmaDetail = id => Vue.axios.get(`/rma/${id}`)
const cancelRmaApply = id => Vue.axios.put(`/rma/cancel/${id}`)
const getRefundReason = () => Vue.axios.get('/rma/static/refund-reason')
const submitRefund = queryCondition => Vue.axios.post('/rma/submit', queryCondition)
const editRefund = queryCondition => Vue.axios.put(`/rma/modify/${queryCondition.id}`, queryCondition)
const getShippingList = () => Vue.axios.get('/rma/static/logistics')
const submitRefundShipping = queryCondition => Vue.axios.put(`/rma/logistics/${queryCondition.id}`, queryCondition)

export default {
  getRmaList,
  getPreRmaApplyDetail,
  getRmaDetail,
  cancelRmaApply,
  getRefundReason,
  submitRefund,
  editRefund,
  getShippingList,
  submitRefundShipping
}
