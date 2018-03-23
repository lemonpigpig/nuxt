<template>
  <div class="address-modal" id="address-modal" v-if="show">
    <div class="modal">
        <div class="modal-close" @click="close">X</div>
        <div class="modal-title">{{data.title}}</div>
        <div class="modal-content">
            <edit-address></edit-address>
            <div class="section" style="margin-top:20px">
              <div class="input"><input type="checkbox" style="width:14px;margin-right:8px"></div>
              <div class="section-title">设为默认</div>
              <div class="section-button">
                <div class="modal-button" style="background-color: #ff4544">保存收货人信息</div>
                <div class="modal-button" @click="close">取消</div>
              </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import EditAddress from '~components/biz/address'
export default {
  name: 'address-detail',
  components: {
    [EditAddress.name]: EditAddress
  },
  data () {
    return {
      show: false,
      data: {
        title: '',
        name: '',
        address: '',
        addressInfo: '',
        phone: '',
        telePhone: '',
        otherAddress: ''
      }
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    addressData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    showModal () {
      this.$set(this, 'show', true)
    },
    close () {
      this.$set(this, 'show', false)
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    if (this.addressData && this.addressData.name) {
      this.$set(this, 'data', this.addressData)
    }
  }
}
</script>
<style lang="less">
#address-modal {
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  position: fixed;
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 660px;
    height: 500px;
    background-color: white;
    margin: auto;
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
      width: 100%;
      text-align: right;
      font-size: 30px;
      padding: 5px 15px 10px 0px;
      box-sizing: border-box;
    }
    .modal-title {
      font-size: 22px;
      font-weight: 600;
      color: #333333;
      padding-left: 60px;
    }
    .modal-content {
      padding: 20px 60px 10px 60px;
      .section {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px 0px;
        .section-title {
            width: 85px;
            font-size: 14px;
            text-align: left;
            color: #999999;
        }
        .input input {
          margin-right: 24px;
        }
        .section-button {
          margin-left: auto;
          display: flex;
          flex-direction: row;
          margin-right: 28px;
          .modal-button {
            padding: 10px 0px;
            min-width: 160px;
            text-align: center;
            font-size: 14px;
            color: white;
            background-color: #908888;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
