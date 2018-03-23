<template lang="html">
  <div id="my-coupon">
      <div class="tab">
          <span
          v-for="(navTab, index) in navtabs"
          :class="{active: index === flag}"
          @click="switchTab(index)"
          >{{navTab.text}}</span>
      </div>
      <!-- <div class="search">
          <input type="text" placeholder="请输入优惠券兑换码">
          <button type="button">兑换</button>
      </div> -->
      <div class="coupon-area" v-if="couponList.length">
          <div class="coupon" v-for="item in couponList">
              <coupon :couponinof="item"></coupon>
          </div>
      </div>
      <p class="no-result" v-else>暂无可用优惠券</p>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import coupon from '~components/biz/coupon/coupon-use.vue'
export default {
  name: 'myCoupon',
  data () {
    return {
      navtabs: [
        { text: '未使用' },
        { text: '已使用' },
        { text: '已过期' }
      ],
      validCouponList: [],
      usedCouponList: [],
      expiredCouponList: [],
      couponList: [],
      flag: 0
    }
  },
  computed: {
    couponListData () {
      return this.$store.state.account.couponList || []
    }
  },
  methods: {
    getCouponHandle () {
      this.$store.dispatch('account/getCouponList').then(() => {
        this.couponListData.forEach((item) => {
          if (item.status === 2) {
            if (!this.isExpired(item.useEndTime)) {
              item.status = 4
              this.expiredCouponList.push(item)
            } else {
              this.validCouponList.push(item)
            }
          } else if (item.status === 3) {
            this.usedCouponList.push(item)
          }
        })
        this.$set(this, 'couponList', cloneDeep(this.validCouponList))
      }).catch((err) => {
        this.$store.commit('common/setMessage', err || err.msg)
      })
    },
    switchTab (index) {
      this.$set(this, 'flag', index)
      if (index === 0) {
        this.$set(this, 'couponList', cloneDeep(this.validCouponList))
      } else if (index === 1) {
        this.$set(this, 'couponList', cloneDeep(this.usedCouponList))
      } else {
        this.$set(this, 'couponList', cloneDeep(this.expiredCouponList))
      }
    },
    isExpired (data) {
      const diff = new Date(data.replace(/T/, ' ')).getTime() - new Date().getTime()
      if (diff >= 0) {
        return true
      }
    }
  },
  mounted () {
    this.getCouponHandle()
  },
  components: { coupon }
}
</script>

<style lang="less">
#my-coupon {
  .tab {
    margin-bottom: 20px;
    span {
      display: inline-block;
      font-size: 16px;
      margin-right: 46px;
      color: #333;
      line-height: 24px;
      cursor: pointer;
    }
    .active {
      color: #ff4544;
      font-weight: 600;
      border-bottom: 3px solid #ff4544;
    }
  }
  .search {
    margin-bottom: 23px;
    input {
      padding-left: 10px;
      width: 344px;
      height: 36px;
      border: 1px solid #ccc;
      font-size: 14px;
    }
    button {
      border: none;
      color: #fff;
      width: 100px;
      height: 36px;
      font-size: 16px;
      background: #ff4544;
    }
  }
  .coupon-area {
    padding: 25px 16px 52px 20px;
    border: 1px solid #f4f4f4;
    .coupon {
        float: left;
        margin-right: 19px;
        margin-bottom: 53px;
    }
  }
  .no-result {
      font-size: 14px;
      color: #333;
      margin-top: 100px;
      text-align: center;
  }
}
</style>
