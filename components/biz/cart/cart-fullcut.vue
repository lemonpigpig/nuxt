<template>
  <div class="cart-gift">
    <div class="goods-show">
      <gz-cart-promotion-fullcut-navigation
      ref="fullcutNavigation"
      :ruleName="promotion.ruleName" tagColor="#ff4544"
      :ruleListLen="promotion.ruleListLen"
      :isTopestRule="promotion.isTopestRule"
      :ruleList="promotion.promotionRuleList"
      :ruleType="promotion.ruleType"
      :isApplyed="promotion.isApplyed"
      :promotionType="promotion.promotionType"
      :promotionId="promotion.promotionId">
        <div slot="promotionShow">
            <template v-if="appliedOrLowestRule.type === BizConst.ITEM_TYPE_GIFT && promotion.isApplyed">
              活动商品已购满¥<span v-text="appliedOrLowestRule.threshold"></span>，可免费领取赠品
            </template>
            <template v-else-if="appliedOrLowestRule.type === BizConst.ITEM_TYPE_GIFT && !promotion.isApplyed">
              活动满¥<span v-text="appliedOrLowestRule.threshold"></span>，可免费领取赠品礼包
            </template>
            <template v-else-if="appliedOrLowestRule.type === BizConst.PROMOTION_FULLCUT_RULE_TYPE_DISCOUNT && promotion.isApplyed">
              已购满¥<span v-text="appliedOrLowestRule.threshold"></span>，享受减¥<span v-text="appliedOrLowestRule.reduceAmount">优惠</span>
            </template>
            <template v-else-if="appliedOrLowestRule.type === BizConst.PROMOTION_FULLCUT_RULE_TYPE_DISCOUNT && !promotion.isApplyed">
              活动商品满¥<span v-text="appliedOrLowestRule.threshold"></span>，可享受减¥<span v-text="appliedOrLowestRule.reduceAmount"></span>
            </template>
        </div>
      </gz-cart-promotion-fullcut-navigation>
      <div class="gift-wrap">
        <gz-cart-goods-base :goods="itemGoods" v-for="(itemGoods, index) in promotion.promotionItemList" :key="gift"
        :ruleType="promotion.ruleType" :ruleListLen="promotion.ruleListLen" v-if="itemGoods.itemType === BizConst.ITEM_TYPE_NORMAL">
        </gz-cart-goods-base>
        <div class="look-gift" @click.stop.prevent="lookGift()" :class="{lightgrey: lack}"
            v-if="(promotion.ruleType === BizConst.PROMOTION_FULLCUT_RULE_TYPE_GIFT || promotion.ruleType === BizConst.PROMOTION_FULLCUT_RULE_TYPE_DISCOUNT_AND_GIFT)
             && promotion.appliedRule && promotion.appliedRule.giftList && promotion.appliedRule.giftList.length > 0">
          <span class="gift-button" v-if="!lack">赠品礼包</span>
          <span class="gift-button part-lack" v-if="lackTypeNum === this.lackType.PART_LACK">部分不足</span>
          <span class="gift-button lack" v-if="lack">赠品礼包不足</span>
          (<span class="gift-detail">{{goodsDetail}}</span>)
          <span class="gift-action" :style="{color: lack ? '#999999' : ''}">查看详情</span>
          <span class="gift-icon" :class="{rotate: !showGifts}"><gz-icon icon="more" size="12"></gz-icon></span>
        </div>
        <div class="gift-list" v-show="showGifts" v-if="promotion.appliedRule && (promotion.appliedRule.type === BizConst.PROMOTION_FULLCUT_RULE_TYPE_GIFT || promotion.appliedRule.type  === BizConst.PROMOTION_FULLCUT_RULE_TYPE_DISCOUNT_AND_GIFT) " :class="{greyopacity: lack}">
          <div class="gift-item" v-for="gift in promotion.appliedRule.giftList" v-if="gift.itemType === BizConst.ITEM_TYPE_GIFT">
            <div class="item-left">
              <img :src="gift.goodsImage" :style="{opacity: checkInvalid(gift) && !lack ? 0.4 : 1}"/>
            </div>
            <div class="item-right">
              <div class="goods-name" :style="{color: checkInvalid(gift) ? '#ffa9a8' : ''}">
                <span :style="{color: lack ? '#333333' : ''}">{{gift.goodsName}} x{{gift.goodsQuantity}}</span>
              </div>
              <div class="goods-price" :style="{color: checkInvalid(gift) ? '#ffa9a8' : ''}">
                <span :style="{color: lack ? '#333333' : ''}">￥{{gift.computedPrice}}</span>
                <span class="enough" :style="{color: lack ? '#333333' : ''}" v-if="checkInvalid(gift)">赠品不足</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import CartGoodsBase from '~components/biz/cart/cart-goods-base'
import CartPromotionNavigation from '~components/biz/cart/cart-promotion-fullcut-navigation'
import CartTool from '~components/biz/cart/mixin/cart-tool'
import BizConst from '~/biz/const'

const lackType = {PART_LACK: 1, ALL_LACK: 2, NO_LACK: 3}

export default {
  name: 'gz-cart-fullcut',
  props: {
    promotion: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [CartTool],
  computed: {
    gift (index) {
      return 'gift'.concat(index)
    },
    lackTypeNum () {
      let appliedRuleGiftList = []
      if (this.promotion.appliedRule && this.promotion.appliedRule.giftList) {
        appliedRuleGiftList = this.promotion.appliedRule.giftList
      }
      if (appliedRuleGiftList && appliedRuleGiftList.length > 0) {
        let _lackType = this.lackType.NO_LACK
        let count = 0
        appliedRuleGiftList.forEach((goods) => {
          if (goods.stock <= 0 ||
            goods.status === BizConst.GOODS_STATUS_NOT_FOR_SALE ||
            goods.status === BizConst.GOODS_STATUS_ONLY_DISPLAY || goods.stock < goods.goodsQuantity) {
            count++
            _lackType = this.lackType.PART_LACK
          }
        })
        if (count === appliedRuleGiftList.length) {
          _lackType = this.lackType.ALL_LACK
        }
        return _lackType
      }
    },
    lack () {
      return this.lackTypeNum === this.lackType.ALL_LACK
    },
    goodsDetail () {
      if (this.promotion.promotionRuleList && this.promotion.promotionRuleList.length > 0) {
        const selectedRule = _.find(this.promotion.promotionRuleList, rule => rule.id === this.promotion.ruleId)
        if (selectedRule) {
          if (selectedRule.giftList && selectedRule.giftList.length > 0) {
            let names = []
            selectedRule.giftList.forEach((goods) => {
              names.push(`${goods.goodsName} x${goods.goodsQuantity}`)
            })
            let _goodsDetail = names.join(',')
            if (_goodsDetail.length > 32) {
              _goodsDetail = _goodsDetail.slice(0, 32) + '...'
            }
            return _goodsDetail
          }
        }
      }
    },
    discount (index) {
      return 'discount'.concat(index)
    },
    appliedOrLowestRule () {
      return this.promotion.isApplyed ? this.promotion.appliedRule : this.promotion.lowestRule
    }
  },
  data () {
    return {
      showGifts: false,
      BizConst,
      lackType
    }
  },
  components: {
    [CartGoodsBase.name]: CartGoodsBase,
    [CartPromotionNavigation.name]: CartPromotionNavigation
  },
  methods: {
    lookGift () {
      this.$set(this, 'showGifts', !this.showGifts)
    },
    checkInvalid (gift) {
      return gift.stock <= 0 || gift.status !== BizConst.GOODS_STATUS_FOR_SALE || gift.stock < gift.goodsQuantity
    }
  },
  watch: {
  },
  mounted () {
  }
}
</script>

<style lang="less">
.cart-gift {
  .look-gift {
      height: 36px;
      line-height: 36px;
      background-color: #ffdada;
      font-size: 12px;
      color: #ffa9a8;
      .gift-button {
          padding: 3px 5px;
          background-color: #ff4544;
          margin-left: 60px;
          margin-right: 15px;
          color: white;
      }
      .part-lack {
          background-color: #999999;
          margin-left: -15px;
      }
      .lack {
          background-color: #999999;
      }
      .gift-detail {
          width: 380px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
      }
      .gift-action {
          color:#ff4544;
          margin-left: 20px;
          margin-right: 4px;
      }
      .rotate {
          .gz-icon {
            transform: rotate(-90deg);
          }
      }
  }
  .gift-list {
    padding-left: 50px;
    width: 100%;
	  background-color: rgba(255, 236, 236, 0.5);
    .gift-item {
      padding: 15px 0px 10px;
      width: 33.33%;
      display: inline-block;
      .item-left {
        width: 82px;
        height: 82px;
      }
      >div{
        display: inline-block;
        vertical-align: top;
      }
      .item-right {
        margin-left: 20px;
        margin-left: 10px;
        .goods-name {
          display: block;
          font-size: 14px;
          padding-top: 14px;
          line-height: 1.43;
          color: #333333;
          height: 64px;
          width: 270px;
          word-break: break-all;
        }
        .goods-price {
          display: block;
          font-size: 14px;
        	font-weight: 600;
        	color: #ff4544;
          .enough {
              margin-left: 50px;
              font-weight: 300;
          }
        }
      }
    }
  }
  .lightgrey {
      color: #999999;
      background-color: #dddddd;
  }
  .greyopacity {
      background-color: #dddddd;
      opacity: 0.4;
  }
}
</style>
