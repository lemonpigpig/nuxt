<template lang="html">
  <div class="cart-goods-base uk-flex uk-flex-wrap-top uk-flex-space-between"
  :class="{'cart-invalid': isInvalid}">
    <slot name="status">
      <div class="allCheck uk-flex uk-flex-wrap-top">
        <input type="checkbox" v-model="checkedIds" :value="goods.goodsId" @click="updateSelectStatus($event.target, goods)"/>
      </div>
    </slot>
    <div class="divisionLine uk-flex uk-flex-space-between uk-flex-item-1">
      <div class="goodsImage">
        <nuxt-link :to="`/goods/${goods.goodsId}`"><img :src="goods.goodsImage"/></nuxt-link>
      </div>
      <div class="goodsName">
        <span class="goods-tag" v-if="goods.isAbholung">自提</span>
        <slot name="goodsName">
          <a :href="`/goods/${goods.goodsId}`">{{goods.goodsName}}</a>
          <div class="presale" v-if="goods.isPresale">
            <gz-icon icon="info1" size="16"/>预计{{presaleTime(goods.presaleTime)}}发货
          </div>
        </slot>
      </div>
      <div class="goodsPrice uk-flex-item-1" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{goods.computedPrice}}</div>
      <div class="goodsNum">
        <slot name="goodsNum">
          <change-number
            :goodsQuantity="goods.goodsQuantity"
            :increment="goods.increment"
            :minLimit="goods.minLimit"
            :goodsLimit="goods.stock"
            :goodsId = "goods.goodsId"
            :item="goods">
          </change-number>
        </slot>
      </div>
      <div class="goodsSum uk-flex-item-1" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥<span>{{goods.goodsTotalPrice}}</span></div>
      <div class="operate uk-flex-item-1">
        <slot name="oprate">
          <template v-if="!goods.itemType || (goods.itemType && goods.itemType !== 2)">
            <!-- <a @click="addGoodsToFavorite(goods.goodsId)">移入收藏夹</a> -->
            <div><a @click="showConfirmModal(showModel, goods.goodsId)">删除</a></div>
          </template>
        </slot>
      </div>
    </div>
    <alert-modal ref="cartItemAlertModal" @comfirm="deleteGoods(currentId, closeModel)">
      <div slot="modal-content">确定删除商品吗？</div>
    </alert-modal>
  </div>
</template>

<script>
import ChangeNum from '~components/biz/cart/change-num'
import CartTool from '~components/biz/cart/mixin/cart-tool'
import AlertModal from '~components/alert-modal'

export default {
  name: 'gz-cart-goods-base',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    ruleType: {
      type: Number,
      default: 0
    },
    ruleListLen: {
      type: Number,
      default: 0
    }
  },
  mixins: [CartTool],
  computed: {
  },
  data () {
    return {
      currentId: 0,
      selectedCartSize: 0
    }
  },
  components: {
    [ChangeNum.name]: ChangeNum,
    AlertModal
  },
  methods: {
    updateSelectStatus (target, goods) {
      if (target.checked) {
        this.selectGoods([target.value])
      } else {
        this.cancelGoods([target.value], goods)
      }
    },
    showModel (data) {
      this.$refs.cartItemAlertModal.showModal()
      this.$set(this, 'currentId', data)
      console.log('currentId:', data)
    },
    closeModel () {
      this.$refs.cartItemAlertModal.close()
    }
  },
  watch: {
  },
  mounted () {
    // console.log('item:', this.item)
  }
}
</script>

<style lang="less">
.cart-goods-base {
  font-size: 14px;
  color: #333;
  background: #f4f4f4;
  padding-top: 22px;
  box-sizing: border-box;
  border-bottom: 1px solid #dddddd;
  &:last-child {
      border-bottom: none;
  }
  a {
    color: #333;
  }
  .divisionLine{
    padding-bottom: 25px;
  }
  .goodsImage{
    width: 100px;
    img{width: 76px;height: 76px;}
  }
  .allCheck{width:60px;}
  .goodsName{
    width: 33%;
    font-size: 14px;
    color: #333333;
    padding-right: 60px;
    .goods-tag{
      background-color: #555c78;
      padding: 2px 5px;
      color: white;
      font-size: 12px;
      margin: 0 5px 0 0;
    }
    a {
      color: #333;
    }
    .presale {
      width: 100%;
      margin-top: 17px;
      color: #ff4544;
      font-size: 14px;
      .gz-icon {
        background: #ff4544;
        border-radius: 16px;
        color: #fff;
        margin-right: 16px;
        margin-left: 12px;
      }
      padding-top: 4px;
      padding-bottom: 5px;
      background: rgba(255, 69, 68, 0.1)
    }
    p{width: 90%}
  }
  &.cart-invalid {
    color:#ccc;
    .goodsName, .goodsSum{
      color:#ccc;
      a {
        color:#ccc;
      }
    }
  }
  .goodsNum{width: 20%;}
  .goodsSum{font-size: 14px;font-weight: 600;color: #ff4544;font-family: Hiragino Sans GB, Microsoft Yahei;}
  .operate{width: 15%;font-size: 14px;color: #333333;cursor: pointer;}
}
</style>
