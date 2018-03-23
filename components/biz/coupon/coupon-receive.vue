<template lang="html">
  <div class="coupon-box" @click="receive">
      <div class="coupon-left">
        <div class="price" v-if="item.faceValue">
            <span style="font-family: Hiragino Sans GB,Microsoft Yahei;font-size:22px">¥</span>{{item.faceValue}}<span>{{condition}}</span>
        </div>
        <div class="name" v-if="item.couponName">
            {{item.couponName}}
        </div>
        <div class="duetime" v-if="item.endTime">
            有效期至{{item.endTime.split('T')[0]}}
        </div>
      </div>
      <div class="coupon-right">
        <div class="coupon-name" :class="{orange: condition.startsWith('无'), grey: showGrey}" :style="{opacity: showGrey || showReceived? 0.2 : 1}">立即领取</div>
        <div class="triangle" v-if="showReceived">
          <div class="character-box" :class="{orangeback: condition.startsWith('无')}">已领</div>
        </div>
        <div class="due" v-if="isDue && item.received"></div>
        <div class="nostock" v-if="stock<=0"></div>
      </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'coupon-receive',
  data () {
    return {
    }
  },
  components: {
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    goodsId: ''
  },
  methods: {
    receive () {
      this.$store.dispatch('promotion/receiveCoupon', this.item.couponId).then((data) => {
        if (data && data.couponNo) {
          this.$store.commit('common/setMessage', '领取成功')
          if (this.goodsId) {
            this.$store.dispatch('promotion/getCouponsByGoodsId', this.goodsId)
            return
          }
          this.$store.dispatch('promotion/getCouponsList')
        }
      })
    }
  },
  computed: {
    condition () {
      let condition = ''
      if (this.item.useOrderAmountLimit > 0) {
        condition = `满${this.item.useOrderAmountLimit} `
      } else {
        condition = '无门槛 '
      }
      if (this.item.isGlobal) {
        condition += '全场通用'
      } else {
        condition += '指定商品'
      }
      return condition
    },
    stock () {
      return this.item.generateQty - this.item.getCount
    },
    isDue () {
      var now = moment().format('YYYY-MM-DD')
      return this.item.limitTime < now
    },
    showGrey () {
      return this.stock <= 0
    },
    sessionId () {
      return this.$store.state.authorization.sessionId
    },
    showReceived () {
      const sessionId = this.$store.state.authorization.sessionId
      if (sessionId && this.stock > 0) {
        if (this.item.getQtyLimit > 0 && this.item.myGetCount >= this.item.getQtyLimit) {
          return true
        }
      }
      return false
    }
  },
  mounted () {}
}
</script>

<style lang="less">
.coupon-box{
    width: 260px;
    height: 100px;
    border: solid 1px #f4f4f4;
    background-color: white;
    padding-left: 15px;
    cursor: pointer;
    .coupon-right {
      float:right;
      width: 60px;
      height: 100%;
      overflow: hidden;
      .coupon-name {
        font-size: 16px;
        line-height: 1.12;
        text-align: center;
        color: #ffffff;
        padding: 32px 10px;
        background-image: url('~static/img/coupon/red.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
      .triangle {
        overflow: hidden;
        margin-top: -45px;
        padding-top: 23px;
        padding-left: 12px;
        height: 50px;
        .character-box {
          -webkit-transform: rotate(-45deg);
	        transform: rotate(-45deg);
          font-size: 10px;
          color: white;
          background: #ff4544;
          width: 80px;
          text-align: center;
          height: 30px;
        }
        .orangeback {
          background: #ff8d00;
        }
      }

      .due {
        height: 60px;
        margin-top: -58px;
        width: 60px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('~static/img/coupon/due.png');
      }
      .nostock {
        height: 60px;
        margin-top: -58px;
        width: 60px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('~static/img/coupon/out.png');
      }
      .orange {
        background-image: url('~static/img/coupon/orange.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
      .grey {
        background-image: url('~static/img/coupon/grey.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
      &:after {
        clear:both;
      }
    }
    .coupon-left {
        padding: 10px 0px;
        width: 180px;
        display: inline-block;
        .price {
          width: 180px;
          font-size: 24px;
          color: #333333;
          margin-bottom: 5px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          span {
            font-size: 12px;
            margin-left: 5px;
          }
        }
        .name {
          width: 180px;
          font-size: 16px;
          text-align: start;
          color: #333333;
          line-height: 18px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .duetime {
          font-size: 12px;
          color: #999999;
        }
    }
}
</style>
