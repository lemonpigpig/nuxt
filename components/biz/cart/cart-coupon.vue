<template>
  <div class="cart-coupon">
    <gz-cart-goods-base :goods="item"></gz-cart-goods-base>
  </div>
</template>

<script>
import CartGoodsBase from '~components/biz/cart/cart-goods-base'

export default {
  name: 'gz-cart-coupon',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  components: {
    [CartGoodsBase.name]: CartGoodsBase
  },
  methods: {
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    console.log('item:', this.item)
  }
}
</script>

<style lang="less">
</style>
