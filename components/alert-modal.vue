<template>
  <div class="address-info" id="address-info" v-if="show">
    <div class="modal">
        <div class="modal-close" v-if="showCancel" @click="close">X</div>
        <div class="modal-content-alert">
            <slot name="modal-content" class="content"></slot>
        </div>
        <div class="button-group">
          <div class="info-button" :style="{ margin : this.showCancel ? '' : '0 auto' }" style="background-color: #ff4544" @click="comfirm">确定</div>
          <div class="info-button" v-if="showCancel" @click="close">{{showCancel ? '取消': '返回'}}</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alert-modal',
  data () {
    return {
      show: false
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    showCancel: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    showModal () {
      this.$set(this, 'show', true)
    },
    close () {
      this.$set(this, 'show', false)
      this.$emit('close')
      if (!this.showCancel) {
        this.$router.go(-1)
      }
    },
    hide () {
      this.$set(this, 'show', false)
    },
    comfirm () {
      this.$emit('comfirm')
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  }
}
</script>
<style lang="less">
#address-info {
  z-index: 11;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  position: fixed;
  .modal {
    position: fixed;
    top: 15%;
    right: 0;
    left: 0;
    width: 660px;
    background-color: white;
    margin: 0 auto;
    z-index: 2;
    text-align: left;
    .modal-close {
      width: 100%;
      text-align: right;
      font-size: 30px;
      padding: 5px 15px 10px 0px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .modal-content-alert {
      padding: 40px 0px;
      max-height: 450px;
      text-align: center;
      font-size: 22px;
      color: #333333;
      .content{
        margin-bottom: 10px;
      }
      // overflow-y:scroll;
    }
    .button-group {
      display: flex;
      cursor: pointer;
      flex-direction: row;
      margin: 20px 152px;
      .info-button {
        padding: 14px 0px;
        margin: 0px 10px;
        width: 158px;
        text-align: center;
        background-color: #908888;
        color: white;
      }
    }
  }
}
</style>
