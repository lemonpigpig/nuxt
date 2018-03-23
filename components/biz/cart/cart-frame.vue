<template lang="html">
  <div class="wrapper cart-frame">
    <div class="heading uk-flex uk-flex-middle uk-flex-space-between">
      <div class="allCheck">
        <label>
          <input type="checkbox"
            v-model="checkedAll" @click="updataAllGoods"/>
        </label>
      </div>
      <div class="uk-flex uk-flex-space-between uk-flex-item-1">
        <div class="checkAll">全选</div>
        <div class="goodsName">商品名称</div>
        <div class="goodsPrice uk-flex-item-1">单价</div>
        <div class="goodsNum">数量</div>
        <div class="goodsSum uk-flex-item-1">小计</div>
        <div class="operate uk-flex-item-1">操作</div>
      </div>
    </div>
    <slot></slot>
    <div class="oneself-take-goods-errorMsg" v-if="hasOneselfTakeAndNormal">
      <div class="errorMsg-inner">
        <img class="errorMsg-icon" src="~assets/img/warning.svg" />
        <span>亲～自提商品和普通商品不支持同时购买，请分别勾选结算！</span>
      </div>
    </div>
    <div class="foot uk-flex uk-flex-space-between">

        <div class="left">
          <label><input type="checkbox" v-model="checkedAll" @click="updataAllGoods" />全选</label>
          <span class="del" @click="showConfirmModal(showModel)">删除选中商品</span>
          <router-link to="/" tag="a" class="continue">继续购物</router-link>
        </div>
        <div class="right">
          <span class="select">已选商品<span>{{selectedGoodsQuantity}}</span>件</span>
          <span class="discount" v-if="cartInfo.discountTotalAmount">折扣金额-￥{{cartInfo.discountTotalAmount}}</span>
          <span>合计：</span>
          <span class="num" v-if="cartInfo.totalPrice">￥{{cartInfo.totalPrice}}</span>
          <a class="total checkout" :class="{disable: disableCheck}" @click.stop.prevent="checkout">去结算</a>
        </div>
      </div>
      <alert-modal ref="cartFrameAlertModal" @comfirm="delChecked()">
        <div slot="modal-content">确定删除商品吗？</div>
      </alert-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import CartTool from '~components/biz/cart/mixin/cart-tool'
import AlertModal from '~components/alert-modal'

export default {
  name: 'gz-cart-frame',
  components: {
    AlertModal
  },
  mixins: [CartTool],
  data () {
    return {
      selectedGoodsQuantity: 0,
      hasOneselfTakeAndNormal: false,
      loading: false,
      checkoutLoading: false
    }
  },
  computed: {
    ...mapGetters({cartInfo: 'cart/getCartTotalInfo', cartList: 'cart/getCartList'}),
    disableCheck () {
      if (this.checkedIds.length > 0 && !this.hasOneselfTakeAndNormal) return false
      return true
    }
  },
  methods: {
    delChecked () {
      this.deleteGoods(this.checkedIds, this.closeModel)
    },
    getCheckoutGoods () {
      let checkData = []
      this.$store.getters['cart/goodsNotInPromotion']
      .filter(goods => this.checkedIds.indexOf(goods.goodsId) > -1)
      .forEach(goods => (checkData.push({
        goodsId: goods.goodsId,
        goodsQuantity: goods.goodsQuantity,
        IsActivity: goods.tag === 1,
        itemType: goods.itemType
      })))
      this.$store.getters['cart/promotionList']
      .forEach(promotion => {
        if (promotion && promotion.promotionItemList && promotion.promotionItemList.length > 0) {
          promotion.promotionItemList.forEach(goods => {
            if (goods.itemType === 1) {
              if (goods.isSelected && goods.isSelected && goods.goodsLimit > 0 && goods.status === 2) {
                checkData.push({
                  goodsId: goods.goodsId,
                  goodsQuantity: goods.goodsQuantity,
                  IsActivity: goods.tag === 1,
                  itemType: goods.itemType
                })
              }
            } else if (goods.itemType === 2) {
              if (goods.isSelected && goods.goodsLimit > 0 && goods.status === 2 && goods.goodsLimit >= goods.goodsQuantity) {
                checkData.push({
                  goodsId: goods.goodsId,
                  goodsQuantity: goods.goodsQuantity,
                  IsActivity: goods.tag === 1,
                  itemType: goods.itemType
                })
              }
            }
          })
        }
      })
      let newCheckData = _.cloneDeep(checkData)
      newCheckData = newCheckData.reduce((pre, nt) => {
        const item = _.find(pre, it => it.goodsId === nt.goodsId && it.itemType === nt.itemType)
        if (item) {
          item.goodsQuantity += nt.goodsQuantity
        } else {
          pre = _.concat(pre, nt)
        }
        return pre
      }, [])
      return newCheckData
    },
    checkout () {
      if (this.checkoutLoading) {
        this.$store.commit('common/setMessage', '您操作得太频繁，请稍后重试')
        return
      }
      this.checkoutLoading = true
      const goods = this.getCheckoutGoods()
      this.$store.dispatch('order/beforeCreate', {
        goods: goods,
        platformType: 1
      })
      .then((res) => {
        if (res) {
          this.$store.commit('order/setGoodsCache', {
            key: res,
            goods: {
              goods: goods,
              platformType: 1
            }
          })
          this.$store.commit('order/setGoodsIdCache', res)
          this.checkoutLoading = false
          this.$router.push(`/order/create?key=${res}`)
        }
      })
      .catch((err) => {
        this.checkoutLoading = false
        this.$store.commit('common/setMessage', err.msg)
      })
    },
    showModel (data) {
      this.$refs.cartFrameAlertModal.showModal()
    },
    closeModel () {
      this.$refs.cartFrameAlertModal.close()
    },
    updataAllGoods () {
      if (this.loading) {
        this.$store.commit('common/setMessage', '您操作得太频繁，请稍后重试')
        return
      }
      this.loading = true
      let checkData = []
      this.$store.getters['cart/goodsNotInPromotion']
      .forEach(goods => (checkData.push(goods.goodsId)))
      this.$store.getters['cart/promotionList']
      .forEach(promotion => {
        if (promotion && promotion.promotionItemList && promotion.promotionItemList.length > 0) {
          promotion.promotionItemList.forEach(goods => {
            if (goods.goodsLimit > 0 && goods.status === 2 && goods.goodsLimit >= goods.goodsQuantity) {
              checkData.push(goods.goodsId)
            }
          })
        }
      })
      if (this.checkedAll) {
        this.$store.dispatch('cart/cancelGoods', checkData).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$store.dispatch('cart/selectGoods', checkData).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    checkOneselfTakeItems () {
      const selectedItems = this.cartList.filter(item => this.checkedIds.indexOf(item.goodsId) > -1)
      if (selectedItems.length === 0) return false
      return selectedItems.some(item => item.isAbholung) && selectedItems.some(item => !item.isAbholung)
    },
    setHasOneselfTakeAndNormalState () {
      this.$set(this, 'hasOneselfTakeAndNormal', this.checkOneselfTakeItems())
    }
  },
  watch: {
    cartList: {
      handler (list) {
        let count = 0
        if (this.checkedIds && this.checkedIds.length > 0) {
          this.checkedIds.forEach((id) => {
            const item = _.find(list, per => per.goodsId === id)
            if (item) {
              count += item.goodsQuantity
            }
          })
        }
        this.setHasOneselfTakeAndNormalState()
        this.$set(this, 'selectedGoodsQuantity', count)
      },
      deep: true
    }
  },
  mounted () {
    // this.$store.commit('cart/updateCheckedAll', true)
  }
}
</script>

<style lang="less">
.cart-frame {
  margin-top: 22px;
  input[type="checkbox"]{vertical-align: 2px;margin-right: 18px;margin-left: 20px;cursor: pointer;}
  input:checked{}
  .heading{
    background: #f4f4f4;height: 42px;font-size: 14px;color: #999999;
    .allCheck{width:60px;cursor: pointer;}
    .checkAll{width: 100px;}
    .goodsName{width: 33%;}
    .goodsNum{width: 20%;}
    .operate{width: 15%;}
  }
  .oneself-take-goods-errorMsg {
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
      clear: both;
    }
    .errorMsg-inner {
      float: right;
      padding: 8px 34px;
      background: #fff7ea;
      font-size: 14px;
      color: #ffb63b;
      .errorMsg-icon {
        width: 16px;
        margin-right: 14px;
        vertical-align: middle;
      }
    }
  }
  .foot{
    background: #f4f4f4;height: 50px;color:#333;line-height: 50px;font-size: 14px;padding-left:10px;margin-top: 0;margin-bottom: 70px;
    .left{
      input[type="checkbox"]{margin-left: 10px;margin-right: 25px;}
      .continue{color:#ff4544;cursor: pointer;}
      .del{margin-left: 30px;margin-right: 30px;cursor: pointer}
    }
    .right{
      .select{
        color:#999;margin-right: 30px;
        span{margin-left: 5px;margin-right: 5px;}
      }
      .discount {
        margin-right: 30px;
      }
      .num{color: #ff4544;font-size: 22px;font-weight: 600;}
      .total{cursor:pointer;display:inline-block;height: 50px;line-height: 50px;text-align: center;color:#fff;font-size: 18px;background:#ff4544;width: 162px;margin-left: 30px;}
      .checkout.disable {
        color: #999;
        background-color: #eee;
        pointer-events: none;
      }
    }
  }
}
</style>
