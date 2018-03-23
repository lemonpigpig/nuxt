<template>
  <div class="address-info" id="address-info" v-if="show">
    <div class="modal">
        <div class="modal-close" @click="close"><img src="../../../assets/img/Group92.png"></div>
        <div class="modal-title">选择地址</div>
        <div class="modal-content">
            <addressList ref="addressList" @getSelectedItem="selected" :showSetting="false"/>
        </div>
        <div class="button-group">
          <button class="info-button" @click="confirmItem" style="background-color: #ff4544">确定</button>
          <button class="info-button" @click="close">取消</button>
        </div>
    </div>
  </div>
</template>

<script>
import addressList from '~components/biz/address/address-list'

export default {
  name: 'address-info',
  data () {
    return {
      show: false,
      selecteItem: {}
    }
  },
  methods: {
    showModal () {
      this.$set(this, 'show', true)
    },
    close () {
      this.$set(this, 'show', false)
      this.$set(this, 'selecteItem', Object.assign({}))
    },
    selected (item) {
      this.$set(this, 'selecteItem', Object.assign({}, item))
    },
    confirmItem () {
      this.$emit('getSelectedItem', this.selecteItem.name ? this.selecteItem : this.$refs.addressList.addressData[0])
      this.$set(this, 'show', false)
      this.$set(this, 'selecteItem', Object.assign({}))
    }
  },
  mounted () {
  },
  components: { addressList }
}
</script>
<style lang="less">
#address-info {
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  position: fixed;
  .modal {
    position: fixed;
    padding-top: 50px;
    top: 10%;
    right: 0;
    left: 0;
    width: 660px;
    background-color: white;
    margin: 0 auto;
    z-index: 2;
    text-align: left;
    input {
      height: 30px;
      width: 120px;
    }
    textarea {
      height: 50px;
      width: 420px;
    }
    .modal-close {
      position: absolute;
      top: 25px;
      right: 25px;
      text-align: right;
      font-size: 30px;
    }
    .modal-title {
      font-size: 22px;
      font-weight: 600;
      color: #333333;
      padding-left: 50px;
      padding-bottom: 10px
    }
    .modal-content {
      padding: 0px 50px;
      max-height: 470px;
      overflow-y:scroll;
      .defaultBg {
          background: #fff;
      }
      .item-info {
        border: 1px solid #ddd;
        padding: 10px 20px;
        margin-top: 18px;
      }
    }
    .button-group {
      display: flex;
      flex-direction: row;
      margin: 20px 152px;
      .info-button {
        border: none;
        padding: 14px 0px;
        margin: 0px 10px;
        width: 158px;
        text-align: center;
        background-color: #908888;
        color: white;
      }
    }
    .triangle {
      position: relative;
      z-index: 1;
      width: 0;
      height: 0;
      border-bottom: 12px solid red;
      border-left: 12px solid transparent;
      margin: 0px -20px -2px auto;
      .icon-right {
        margin-left: -7px;
        font-size: 6px;
        color: white;
      }
    }
  }
  .selected {
    border:2px solid #ff4544 !important;
  }
}
</style>
