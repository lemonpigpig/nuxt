import Vue from 'vue'

const isSensitive = ({ KeyWords }) => Vue.axios.post('/KeyWords/hassensitive', { KeyWords })

export default {
  isSensitive
}
