<template>
  <div class="message-modal" id="message-modal" v-if="show">
    <div class="modal">
       <div class="modal-content">
            <span v-html="message"></span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message-modal',
  data () {
    return {
      show: false,
      clearTimeoutId: null
    }
  },
  methods: {
    showModal () {
      if (this.clearTimeoutId) clearTimeout(this.clearTimeoutId)
      this.$set(this, 'show', true)
      this.clearTimeoutId = setTimeout(() => this.close(), 2000)
    },
    close () {
      if (this.clearTimeoutId) clearTimeout(this.clearTimeoutId)
      this.$set(this, 'show', false)
      this.$store.commit('common/setMessage', '')
    }
  },
  computed: {
    message () {
      return this.$store.state.common.globleMessage
    }
  },
  watch: {
    message (val) {
      if (val) {
        this.showModal()
      }
    }
  },
  mounted () {
  }
}
</script>
<style lang="less">
#message-modal {
  z-index: 999;
  top: 0;
  left: 0;
  position: fixed;
  .modal {
    position: fixed;
    top: 50%;
    right: 40%;
    left: 40%;
    background-color: white;
    margin: 0 auto;
    z-index: 2;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.7);
    .modal-content {
      padding: 10px 20px;
      max-height: 450px;
      overflow-y:auto;
      color: white;
    }
  }
}
</style>
