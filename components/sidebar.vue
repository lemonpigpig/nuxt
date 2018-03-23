<template>
  <div class="gzpc-sidebar">
   <div class="sidebar">
    <div class="item zxkf">
      <a class="vertical" href="http://webchat.7moor.com/wapchat.html?accessId=be74c570-71e6-11e7-84e7-6bd570ae97d8" target="_blank">
        在线客服
      </a>
    </div>
    <div class="item cart">
      <nuxt-link class="vertical carttext" to="/cart" tag="a" target="_blank">
      购物车
      <span class="cartsize" v-text="cartSize"></span>
      </nuxt-link>
    </div>
    <div class="item coupon" :class="{zxkf: showCoupons}">
      <a class="vertical" @click="sideShowCoupon($event)">领券</a>
      <span class="arrow" v-if="showCoupons"></span>
    </div>
    <div class="item collect">
      <span class="vertical" @click="goMyCollection">我的收藏</span>
    </div>
    <div class="item feedback">
      <span class="vertical" @click="goFeedBack">反馈</span>
    </div>
    <div class="item backTop" @click="goTop">
      <span class="vertical">返回顶部</span>
      <span class="trialog"></span>
    </div>
   </div>
   <div class="coupons-group" :class="{animation: showCoupons}" @click="couponsShow(true, $event)" v-if="couponsList && couponsList.length > 0">
     <div class="coupons" v-for="item in couponsList">
       <coupon-receive :item="item"></coupon-receive>
     </div>
   </div>
   <div class="coupons-group" :class="{animation: showCoupons}" @click="couponsShow(true, $event)" v-else>
     <div class="no-coupons">
         <p>暂无可用优惠券</p>
         <p class="ligter">敬请期待...</p>
     </div>
   </div>
 </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Coupon from '~components/biz/coupon'

export default {
  data () {
    return {
      timer: null,
      isTop: true,
      showCoupons: false,
      sidebarShow: false
    }
  },
  components: {
    [Coupon.couponReceive.name]: Coupon.couponReceive
  },
  methods: {
    goTop () {
      // 设置定时器
      this.timer = setInterval(() => {
        // 获取滚动条距离顶部高度
        const osTop = document.documentElement.scrollTop || document.body.scrollTop
        const ispeed = Math.floor(-osTop / 7)
        document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed
        // 到达顶部，清除定时器
        if (osTop === 0) {
          clearInterval(this.timer)
        }
        this.isTop = true
      }, 30)
    },
    goMyCollection () {
      window.open('/account/center?source=collect-list')
      //  this.$router.replace('/account/center?source=collect-list')
    },
    goFeedBack () {
      if (this.$route.path !== '/feedback/submit-feedback') {
        this.$router.replace('/feedback/submit-feedback')
      }
    },
    sideShowCoupon (event) {
      this.$set(this, 'showCoupons', !this.sidebarShow)
      this.$set(this, 'sidebarShow', !this.sidebarShow)
      if (event) {
        event.stopPropagation()
      }
    },
    couponsShow (status, event) {
      this.$set(this, 'showCoupons', status)
      if (event) {
        event.stopPropagation()
      }
    }
  },
  mounted () {
    window.onscroll = function () {
      // 获取页面可视区高度
      const clientHeight = document.documentElement.clientHeight
      // 显示回到顶部按钮
      const osTop = document.documentElement.scrollTop || document.body.scrollTop
      if (osTop >= clientHeight) {
        // btn.style.display = "block"
      } else {
        // btn.style.display = "none"
      }
      // 回到顶部过程中用户滚动滚动条，停止定时器
      if (!this.isTop) {
        clearInterval(this.timer)
      }
      this.isTop = false
    }
    this.$store.dispatch('promotion/getCouponsList')
    this.$store.dispatch('cart/getMergedCart')
  },
  computed: {
    ...mapGetters({
      cartSize: 'cart/cartSize'
    }),
    sessionId () {
      return this.$store.state.authorization.sessionId || ''
    },
    couponsList () {
      return this.$store.state.promotion.couponsList || []
    }
  },
  watch: {
    sessionId (val) {
      if (val) {
        this.$store.dispatch('promotion/getCouponsList')
      }
    },
    showCoupons (val) {
      if (!val) {
        this.sidebarShow = false
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less">
.gzpc-sidebar {
  height: 100%;
  .animation {
    right: 46px;
  }
}
.sidebar {
  position: fixed;
  top: 50%;
  right: 0;
  width: 36px;
  z-index: 100;
  transform: translateY(-50%);
  height: auto;
  .item {
    text-align: center;
    height: 50px;
    font-size: 12px;
    color: #ffffff;
    line-height: 1.17;
    background: #908888;
    border-bottom: 1px solid #fff;
    display:table;
    width: 36px;
    cursor: pointer;
    &.cart:hover, &.coupon:hover, &.collect:hover, &.feedback:hover {
      background: #ff4544;
    }
    &:last-child {
      border-bottom: none;
    }
    a {
      color: white;
      text-decoration: none;
    }
  }
  .cart {
    position: relative;
    padding-left: 6px;
    padding-right: 5px;
    text-align: left;
    .carttext {
      width: 25px;
      color: #fff;
      text-decoration: none;
    }
    .cartsize {
        height: 13px;
        width: 22px;
        background: #ff4544;
        position: absolute;
        border-radius: 100px;
        line-height: 13px;
        transform: scale(0.8);
        left: 14px;
        display: inline-block;
        bottom: 13px;
        text-align: center;
    }
    &:hover .cartsize {
      color: #ff4544;
      background: #fff;
    }
  }
  .zxkf {
    background-color: #ff4544;
    a {
      color: #fff;
      text-decoration:none;
    }
  }
  .backTop {
    background: #651525;
    position: relative;
  }
  .vertical {
    display: table-cell;
    vertical-align: middle;
  }
  .arrow {
    position: absolute;
    width: 0px;
    height: 0px;
    background: transparent;
    display: inline-block;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid white;
    top: 119px;
    left: 0px;
  }
  .trialog {
    position: absolute;
    width: 0px;
    height: 0px;
    background: transparent;
    display: inline-block;
    border-top: none;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 4px solid #fff;
    bottom: 5px;
    left: 15px;
  }
}
.coupons-group {
  position: fixed;
  top: 0px;
  right: -300px;
  width: 280px;
  bottom:0px;
  overflow: auto;
  z-index:9999;
  padding: 5px 10px;
  background-color: #f4f4f4;
  -moz-transition-property:all;
  -moz-transition-duration:0.4s;
  /* Safari and Chrome */
  -webkit-transition-property:all;
  -webkit-transition-duration:0.4s;
  /* Opera */
  -o-transition-property:all;
  -o-transition-duration:0.4s;
  .coupons {
    margin: 10px 0px;
  }
  .no-coupons {
    position: relative;
    top: 48%;
    color: #666666;
    padding:0px 67px;
    .ligter {
      font-size: 12px;
      color: #999999;
      margin-top: 2px;
    }
  }
}
</style>
