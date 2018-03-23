<template>
  <div class="cart-invalid">
    <gz-cart-goods-base :goods="item" :isInvalid="true">
      <div slot="status">
        <div class="allCheck uk-flex uk-flex-wrap-to">
          <span class="invalid-tag">失效</span>
        </div>
      </div>
      <div slot="goodsNum">
        <div class="goodsNum">{{item.goodsQuantity}}</div>
      </div>
    </gz-cart-goods-base>
  </div>
</template>

<script>
import CartGoodsBase from '~components/biz/cart/cart-goods-base'

export default {
  name: 'gz-cart-invalid',
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
  }
}
</script>

<style lang="less">
.cart-invalid{
  .invalid-tag{
    width: 40px;
    height: 20px;
    background-color: #dddddd;
    margin-right: 20px;
    margin-left: 10px;
    color: #999;
    font-size: 12px;
    text-align: center;
  }
}
</style>
