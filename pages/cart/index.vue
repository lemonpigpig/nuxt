<template>
  <div class="gz-pc-cart" id="gz-pc-cart">
      <div class="wrapper">
          <div v-if="cartSize && cartSize > 0">
            <gz-cart-frame ref="gzCartFrame">
              <gz-cart-region ref="gzCartRegion" :goodsNotInPromotion="goodsNotInPromotion" :invalidCartList="invalidCartList" :promotionList="promotionList"></gz-cart-region>
            </gz-cart-frame>
          </div>
          <div class="empty_cart" v-else>
            <div class="cart"><img src="../../assets/img/cart_empty.png"/></div>
            <div class="cart_reminder">购物车空空的哦~  去看看心仪的商品吧~</div>
            <nuxt-link class="go_login" to="/account/entry/sign-in" v-show="!isLogin">登录</nuxt-link>
            <nuxt-link class="go_shop" to="/">去购物 >></nuxt-link>
          </div>
          <recommend-goods :pageTypeKey="16" :positionKey="14" class="recommend_goods"></recommend-goods>
      </div>
  </div>
</template>
<script>
import CartFrame from '~components/biz/cart/cart-frame'
import CartRegion from '~components/biz/cart/cart-region'
import RecommendGoods from '~components/recommend-goods'
import { mapActions, mapGetters } from 'vuex'
import CartOneselfTakeTag from '~components/biz/tag/oneself-take-cart'

export default {
  components: {
    [CartFrame.name]: CartFrame,
    [CartRegion.name]: CartRegion,
    [RecommendGoods.name]: RecommendGoods,
    [CartOneselfTakeTag.name]: CartOneselfTakeTag
  },
  data () {
    return {
      isLogin: false
    }
  },
  computed: {
    ...mapGetters({goodsNotInPromotion: 'cart/goodsNotInPromotion', promotionList: 'cart/promotionList', invalidCartList: 'cart/invalidCartList', cartSize: 'cart/cartSize'})
  },
  methods: {
    ...mapActions({ getMergedCart: 'cart/getMergedCart', updateLocalCartItem: 'cart/updateLocalCartItem' }),
    initPageData () {
      this.getMergedCart().then((result) => {
        if (typeof result === 'string') {
          this.$store.commit('common/setMessage', result)
        }
      }).catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    }
  },
  created () {
  },
  mounted () {
    if (!process.SERVER_BUILD) {
      this.isLogin = localStorage.getItem('sessionId') && localStorage.getItem('sessionId') !== 'undefined'
    }
    this.initPageData()
  }
}
</script>

<style lang="less" scoped>
#gz-pc-cart {
  .empty_cart{
    text-align: center;
    font-size: 14px;
    color: #666666;
    padding-top: 60px;
    padding-bottom: 150px;
      .cart_reminder{
        margin-top: 36px;
        margin-bottom: 17px;
      }
      .go_shop, .go_login{
        font-size: 16px;
        font-weight: 300;
        color: #ff4544;
        cursor: pointer;
        width: 75px;
        margin-right: auto;
        margin-left: auto;
        /*border-bottom: 1px solid #ff4544;*/
      }
      .go_login {
        margin-right: 48px;
      }
  }
  .recommend_goods{
    margin-bottom: 97px;
  }
}
</style>
