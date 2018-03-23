import Vue from 'vue'
import LoadingVue from './loading.vue'

const LoadingVueComponent = Vue.extend(LoadingVue)
let loading = null

const toggleLoading = function (_el, binding) {
  if (Vue.prototype.$isServer) return
  const el = _el
  if (binding.value) {
      // loading component
    const loadingOptions = { content: el.getAttribute('loading-text') }
    if (binding.modifiers.mask) {
      loadingOptions.mask = true
    }
    if (binding.modifiers.fullscreen) {
      loadingOptions.fullscreen = true
    }
    if (binding.modifiers.two) {
      loadingOptions.icon = 'two'
    }
    if (binding.modifiers.three) {
      loadingOptions.icon = 'three'
    }
    loading = new LoadingVueComponent({
      data: loadingOptions
    })
    loading.vm = loading.$mount()

    if (binding.modifiers.fullscreen) {
      document.body.appendChild(loading.vm.$el)
    } else {
      el.style.position = 'relative'
      el.appendChild(loading.vm.$el)
    }
  } else if (loading) {
    loading.destroy()
  }
}

Vue.directive('loading', {
  bind (el, binding) {
    toggleLoading(el, binding)
  },

  update (el, binding) {
    toggleLoading(el, binding)
  },

  unbind () {
    if (loading) {
      loading.destroy()
    }
  }
})
