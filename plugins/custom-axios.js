import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
// import router from 'vue-router'
export default ({app: {router}, store}) => {
  const customAxios = axios.create({
    baseURL: process.SERVER_BUILD ? process.env.baseURL : '/api',
    timeout: 10000,
    validateStatus: () => true
  })

  Vue.use(VueAxios, customAxios)
  customAxios.interceptors.request.use((config) => {
    if (config.method === 'get') {
      if (config.url.indexOf('?') > -1) {
        config.url = config.url + '&randomNumber=' + 10 * Math.random()
      } else {
        config.url = config.url + '?randomNumber=' + 10 * Math.random()
      }
    }
    return Object.assign({}, config, {
      headers: {
        token: !process.SERVER_BUILD ? localStorage.getItem('sessionId') : '',
        'Gz-Device': 1
      }
    })
  }, (error) => {
    return Promise.reject(error)
  })
  customAxios.interceptors.response.use((res) => {
    if (res.status && Number(res.status) === 401) {
      if (router.currentRoute.path !== '/account/entry/sign-in') {
        router.replace(`/account/entry/sign-in?redirect=${router.currentRoute.fullPath}`)
      }
      if (!process.SERVER_BUILD) {
        localStorage.removeItem('sessionId')
      }
      // 为什么要使用reject 因为有的时候代码写的不严谨，比如没有登录的时候，返货的数据是null，但是前端却没有考虑直接使用map，foreach等
      return Promise.reject(res.data)
    } else if (res.status === 500) {
      return Promise.reject(new Error('服务器错误！'))
    } else if (res.status >= 404) {
      // router.replace('/error/404')
      return Promise.reject(new Error('页面不存在！'))
    } else if (res.status >= 400) {
      if (res.data.code !== '12014' && res.data.code !== '12001' && res.data.code !== '1000' && res.data.code !== '13011' && res.data.code !== '1021') {
        store.commit('common/setMessage', res.data.msg)
      }
      if (res.data.code === '1004') {
        setTimeout(() => router.replace('/'), 1000)
      }
      return Promise.reject(res.data)
    } else if (res.status === 200) {
      if (res.data === '') {
        return Promise.resolve({ data: { msg: '成功', code: 200 } })
      }
    }
    return res.data
  })
}
