<template lang="html">
  <div class="cart-modal" v-if="show">
    <div class="cart-modal-head">
      <slot name="title">
      </slot>
    </div>
    <div class="cart-modal-content">
      <slot name="content"></slot>
    </div>
    <div class="cart-modal-foot">
      <slot name="foot">
        <span class="btn" @click.stop.prevent="manageMore()">返回</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cart-modal',
  props: {
    ruleType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    manageMore () {
      this.$set(this, 'show', !this.show)
      console.log('manageMore', this.show)
    },
    initModal (isShow) {
      this.$set(this, 'show', isShow)
    }
  }
}
</script>

<style lang="less">
.cart-modal{
  width: 500px;
  height: 420px;
  border: solid 1px #ff4544;
  box-sizing: border-box;
  position: relative;
  &-head{
    width: 100%;
    height: 26px;
    background: #ff4544;
    color: white;
    padding-left: 19px;
    line-height: 26px;
  }
  &-content{
    width: 100%;
    padding-top: 8px;
    padding-left: 20px;
    padding-right: 80px;
    overflow: auto;
  }
  &-foot{
    position: absolute;
    bottom: 13px;
    width: 100%;
    .btn{
        width: 80px;
       height: 34px;
       background-color: #f4f4f4;
       border: solid 1px #dddddd;
       margin: 0 auto;
       display: block;
       font-size: 14px;
       color: #333333;
       text-align: center;
       line-height: 34px;
    }
  }

}
</style>
