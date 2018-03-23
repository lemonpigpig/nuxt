<template>
  <div class="cart-promotion-navigation">
    <div class="promotion-tag-wrapper">
      <div class="tag-wrapper promotion-type" v-text="ruleName" :style="tagStyle">
      </div>
      <div class="promotion-discount-show">
        <slot name="promotionShow">
        </slot>
      </div>
      <div class="promotion-right-navigation">
        <div class="lookmore tag-wrapper" v-text="lookmore" v-if="showDecription" @click="manageMore(true, $event)"></div>
        <div class="ruleList-wrapper cart-modal" v-if="showDecription" v-show="showMoreRule">
          <div class="cart-modal-head" >
            <span class="rule-list-title">{{lookmore}}</span>
          </div>
          <div class="cart-modal-content">
            <div class="content-item" v-for="rule in ruleList" v-bind:key="rule">
              <p v-if="rule.type === BizConst.PROMOTION_FULLCUT_RULE_TYPE_DISCOUNT" class="content-item-discount-desc">
                满<span v-text="rule.threshold" class="threshold"></span>元，可减<span v-text="rule.reduceAmount" class="reduce-amount"></span>元
              </p>
              <div v-else-if="rule.type === BizConst.PROMOTION_FULLCUT_RULE_TYPE_GIFT && rule.giftList && rule.giftList.length > 0" class="item-gift" >
                <img :src="rule.giftList[0].goodsImage"  class="content-img"/>
                <ul class="list">
                  <li v-for="goodsItem in rule.giftList" v-bind:key="goodsItem">
                    <span class="name" v-text="goodsItem.goodsName"></span>
                    <span class="num">x{{goodsItem.goodsQuantity}}</span>
                  </li>
                  <li class="total">
                    <span class="price">¥0.00</span>
                    <span class="info">(满¥{{rule.threshold}}可领取)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="cart-modal-foot">
            <span class="btn" @click.stop.prevent="manageMore(false)">返回</span>
          </div>
        </div>
        <div class="is-show-buy-btn" v-if="!isApplyed || !isTopestRule" @click="goGoodsPool">
          <span>去凑单</span>
          <span class="icon-rotate"><gz-icon icon="more" size="10"></gz-icon></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CartModal from '~components/biz/cart/cart-modal.vue'
import BizConst from '~/biz/const'

export default {
  name: 'gz-cart-promotion-fullcut-navigation',
  props: {
    ruleType: {
      type: Number,
      default: 0
    },
    ruleName: {
      type: String,
      default: ''
    },
    tagColor: {
      type: String,
      default: 'red'
    },
    isTopestRule: {
      type: Boolean,
      default: true
    },
    isApplyed: {
      type: Boolean,
      default: true
    },
    ruleList: {
      type: Array,
      default: () => []
    },
    promotionType: {
      type: Number,
      default: 0
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      lookmore: `${this.ruleName}说明`,
      BizConst,
      showMoreRule: false
    }
  },
  components: {
    CartModal
  },
  methods: {
    manageMore (status, event) {
      this.$set(this, 'showMoreRule', status)
      if (event) {
        event.stopPropagation()
      }
    },
    goGoodsPool () {
      this.$router.push(`/goods-pool/${this.promotionId}?type=${this.promotionType}`)
    }
  },
  computed: {
    tagStyle () {
      return `background-color: ${this.tagColor}; border-color: ${this.tagColor}`
    },
    showDecription () {
      return (this.ruleType === BizConst.PROMOTION_FULLCUT_RULE_TYPE_DISCOUNT && this.ruleList && this.ruleList.length > 1) ||
        (this.ruleType === BizConst.PROMOTION_FULLCUT_RULE_TYPE_GIFT && (!this.isApplyed || (this.ruleList && this.ruleList.length > 1))) ||
        (this.ruleType === BizConst.PROMOTION_FULLCUT_RULE_TYPE_DISCOUNT_AND_GIFT)
    }
  }
}
</script>

<style lang="less">
.promotion-tag-wrapper {
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  &>div{
    display: inline-block;
    vertical-align: top;
  }
  .promotion-type {
    margin-left: 20px;
  }
  .tag-wrapper {
    color: white;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    padding: 0 11px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      border-top-width: 3px;
      border-top-style: solid;
      border-top-color: inherit;
      border-left-width: 3px;
      border-left-style: solid;
      border-left-color: inherit;
      border-right: 3px solid transparent;
      border-bottom: 3px solid transparent;
      top: 22px;
      left: 0px;
    }
  }
  .promotion-discount-show {
    color: #666;
    font-size: 14px;
    line-height: 22px;
    margin-left: 10px;
  }
  .promotion-right-navigation {
    position: relative;
    margin-left: 20px;
    height: 22px;
    line-height: 22px;
    width: 500px;
    .cart-modal{
      position: absolute;
      top: 28px;
      left: 0px;
      width: auto;
      height: auto;
      background: #fff;
      z-index: 999;
      color: #333;
      max-width: 500px;
      max-height: 420px;
      border: solid 1px #ff4544;
      box-sizing: border-box;
      &-head{
        height: 26px;
        background: #ff4544;
        color: white;
        padding-left: 19px;
        line-height: 26px;
        .rule-list-title {
          height: 20px;
          line-height: 20px;
          margin: 2px 0 4px;
        }
      }
      &-content{
        padding-top: 8px;
        padding-left: 20px;
        padding-right: 60px;
        max-height: 310px;
        overflow: auto;
        .content-item{
          // height: 82px;
          padding: 12px 0 16px;
          line-height: normal;
          border-bottom: 1px #eee solid;
          &-discount-desc {
            line-height: 17px;
          }
          .img{
            width: 82px;
            height: 82px;
            border: 1px solid #eeeeee;
            box-sizing: border-box;
            margin-right: 20px;
            float: left;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .list{
            list-style: none;
            margin-left: 20px;
            vertical-align: baseline;
            li.total{
              margin-top: 2px;
            }
            li{
              width: 100%;
              font-size: 14px;
              span.name{
                line-height: 1.43;
                color: #333333;
                max-width: 300px;
                overflow: hidden;
              }
              span.num{
                margin-left: 10px;
                color: #999999;
              }
              .price{
                font-weight: 600;
                color: #ff4544;
              }
              .info{
                font-weight: 600;
                line-height: 1.43;
                color: #333333;
                margin-left: 28px;
              }
            }
          }
        }
      }
      &-foot{
        position: relative;
        margin-bottom: 23px;
        margin-top: 33px;
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
          cursor: pointer;
        }
      }
    }
    .lookmore {
      height: 22px;
      line-height: 22px;
      color: #fff;
      border-color: #ff4544;
      background-color: #ff4544;
      cursor: pointer;
      display: inline-block;
    }
    .threshold,.reduce-amount {
      color: #ff4544;
    }
  }
  .is-show-buy-btn {
    margin-left: 50px;
    display: inline-block;
    cursor: pointer;
    .icon-rotate {
        .gz-icon {
          margin-left: 10px;
          margin-top:3px;
          color:#999999;
          transform: rotate(-90deg);
        }
    }
  }
  ul {
    display: inline-block;
    vertical-align: middle;
  }
  .content-img {
    width: 82px;
    border: solid 1px #eeeeee;
  }
}
</style>
