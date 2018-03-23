import Vue from 'vue'

const sendVerifyCode = data => Vue.axios.post('/users/sendVerificationCode', data)
const phoneExisted = phone => Vue.axios.get(`/users/exist/${phone}`)
const userNameExisted = phone => Vue.axios.get(`/users/exist-usename-cellphone/${phone}`)
const signUp = data => Vue.axios.post('/users/signup', data)
const signIn = data => Vue.axios.post('/users/signIn', data)
const imgVerify = () => Vue.axios.get('/common/img-captcha')
const modifyPassword = data => Vue.axios.post('/users/modifyPassword', data)
const signOut = () => Vue.axios.get('/users/signout')
const getProfile = () => Vue.axios.get('/users')
const verifyForgetPwdStep1 = (queryCondition) => Vue.axios.get(`/common/img-captcha/verify/${queryCondition.sessionId}-${queryCondition.code}`)

export default {
  sendVerifyCode,
  phoneExisted,
  signUp,
  signIn,
  imgVerify,
  modifyPassword,
  signOut,
  getProfile,
  verifyForgetPwdStep1,
  userNameExisted
}
