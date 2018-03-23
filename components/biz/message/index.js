import Vue from 'vue'
import MessageCostructor from './message.vue'

const MessageComponent = Vue.extend(MessageCostructor)

let instance = null

const Message = (options) => {
  if (Vue.prototype.$isServer) return

  if (instance) {
    instance.destroy({}, true)
  }
  instance = new MessageComponent({
    data: {
      message: options.message,
      duration: options.duration,
      customClass: options.customClass
    }
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el) // eslint-disable-line no-undef
  instance.vm.$on('allDone', () => {
    instance = null
  })
}

Message.prototype.clear = () => {
  if (!instance) return
  instance.destroy({}, true)
  instance = null
}

Message.install = () => {
  Vue.prototype.$Message = Message
}

export default Message
