<template lang="html">
  <div class="cart-region">
    <div v-for="(item, index) in promotionList" :key="index" class="cart-row">
       <component :is="cartOption[item.ruleType]" v-if="cartOption" :promotion="item" :key="index"></component>
    </div>
    <div class="cart-row" v-if="goodsNotInPromotion && goodsNotInPromotion.length > 0">
      <gz-cart-goods-base :goods="item" v-for="(item, index) in goodsNotInPromotion" :key="index"></gz-cart-goods-base>
    </div>
    <div class="cart-row" v-if="invalidCartList && invalidCartList.length > 0">
      <gz-cart-invalid :item="item" v-for="(item, index) in invalidCartList" :key="index"></gz-cart-invalid>
    </div>
  </div>
</template>

<script>
import CartTool from '~components/biz/cart/mixin/cart-tool'
import CartRegionData from '~components/biz/cart/mixin/cart-region-data'
// import CartDiscount from '~components/biz/cart/cart-discount'
import CartFullcut from '~components/biz/cart/cart-fullcut'
// import CartCoupon from '~components/biz/cart/cart-coupon'
import CartInvalid from '~components/biz/cart/cart-invalid'
// import CartGift from '~components/biz/cart/cart-gift'
import CartGoodsBase from '~components/biz/cart/cart-goods-base'
import CartCheckGift from '~components/biz/cart/cart-check-gift.vue'

export default {
  name: 'gz-cart-region',
  mixins: [CartRegionData, CartTool],
  components: {
    [CartGoodsBase.name]: CartGoodsBase,
    [CartInvalid.name]: CartInvalid,
    CartCheckGift
  },
  data () {
    return {
      selectedGoodsQuantity: 23,
      cartOption: { 1: CartFullcut, 2: CartFullcut, 3: CartFullcut }
    }
  },
  methods: {
    deleteCartGoods () {
      return Promise.resolve('deleteCartGoods success')
    }
  },
  mounted () {
  },
  watch: {
  }
}
</script>

<style lang="less">
.cart-region{
  padding-top: 13px;
  .cart-row {
    padding-bottom: 40px;
    border-bottom: 1px solid #f4f4f4;
    margin-bottom: 40px;
  }
}
</style>
