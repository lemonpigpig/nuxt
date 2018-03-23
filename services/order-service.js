import Vue from 'vue'

const getOrder = queryCondition =>
Vue.axios.get(`/orders?listType=${queryCondition.listType}&pageSize=${queryCondition.pageSize}&orderSearch=${queryCondition.orderSearch !== '' ? queryCondition.orderSearch : ''}&pageIndex=${queryCondition.pageIndex}`)
const clearGoods = queryCondition => Vue.axios.post('/orders', queryCondition)
const deleteOrder = orderId => Vue.axios.delete(`/orders/${orderId}`)
const getOrderDetail = orderId => Vue.axios.get(`/orders/${orderId}`)
const confirmReceipt = orderId => Vue.axios.put(`/orders/${orderId}`)
const createOrder = queryCondition => Vue.axios.post('/orders/submit', queryCondition)
const cancelOrder = orderId => Vue.axios.get(`/orders/cancel/${orderId}`)
const cancelChildOrder = orderId => Vue.axios.get(`/orders/child/cancel/${orderId}`)
const getPayInfo = sn => Vue.axios.get(`/orders/pay/${sn}`)
const payOrder = queryCondition => Vue.axios.post('/payment', queryCondition)
const getOrderFreight = queryCondition => Vue.axios.post('/orders/freight', queryCondition)
const getPayResult = sn => Vue.axios.get(`/payment/${sn}`)
const confirmPayment = queryCondition => Vue.axios.post('/payment/confirmPayment', queryCondition)
const confirmPosPayment = queryCondition => Vue.axios.post('/payment/posvmPayment', queryCondition)
const beforeCreate = queryCondition => Vue.axios.post('/orders/settlement', queryCondition)

export default {
  getOrder,
  clearGoods,
  deleteOrder,
  getOrderDetail,
  confirmReceipt,
  createOrder,
  cancelOrder,
  cancelChildOrder,
  getPayInfo,
  payOrder,
  getOrderFreight,
  getPayResult,
  confirmPayment,
  confirmPosPayment,
  beforeCreate
}
