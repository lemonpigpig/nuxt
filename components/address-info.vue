<template>
  <div class="address-info" id="address-info" v-if="true">
    <div class="modal">
        <div class="modal-close" @click="close">X</div>
        <div class="modal-title">选择地址</div>
        <div class="modal-content">

        </div>
        <div class="button-group">
          <div class="info-button" style="background-color: #ff4544">确定</div>
          <div class="info-button" @click="close">取消</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'address-info',
  data () {
    return {
      show: false,
      items: [
        { id: 1, location: '家里', name: '张三丰', phone: '13987654321', address: '云南 昆明市 西山区 滇池旅游区 静海园客堂环湖东路静海园56幢' },
        { id: 2, location: '家里', name: '张三丰', phone: '13987654321', address: '云南 昆明市 西山区 滇池旅游区 静海园客堂环湖东路静海园56幢' },
        { id: 3, location: '家里', name: '张三丰', phone: '13987654321', address: '云南 昆明市 西山区 滇池旅游区 静海园客堂环湖东路静海园56幢' }
      ],
      currentItemId: 1
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    showModal () {
      this.$set(this, 'show', true)
    },
    close () {
      this.$set(this, 'show', false)
    },
    select (itemId) {
      this.$set(this, 'currentItemId', itemId)
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
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  position: fixed;
  .modal {
    position: fixed;
    top: 20%;
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
      padding-left: 50px;
    }
    .modal-content {
      padding: 10px 50px;
      max-height: 470px;
      overflow-y:scroll;
      .section {
        border: solid 1px #dddddd;
        padding: 10px 20px 2px 10px;
        margin: 20px 0px;
        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #b7a078;
        }
        .section-body {
          margin-top: 8px;
          font-size: 14px;
          .content {
            height: 26px;
          }
        }
      }
      .light-title {
        color: #999999;
      }
    }
    .button-group {
      display: flex;
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
