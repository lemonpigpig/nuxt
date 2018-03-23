import axios from 'axios'

let options = {}
// The server-side needs a full url to works
if (process.SERVER_BUILD) {
  options.baseURL = process.env.baseURL
} else {
  options.baseURL = '/api'
}

axios.interceptors.request.use((config) => {
  return Object.assign({}, config, {
    headers: {
      token: localStorage && localStorage.getItem('sessionId'),
      'Gz-Device': 1
    }
  })
}, (error) => {
  return Promise.reject(error)
})

export default axios.create(options)
