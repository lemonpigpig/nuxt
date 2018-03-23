<template lang="html">
  <div class="wechat-success">
    <pay-header  :progressinfo="stepinfo"></pay-header>
    <div class="success-content">
      <div class="part1">
        <div class="success-icon">
          <img src="~assets/img/Group122.png" alt="">
        </div>
        <h2 class="delivery-soon">支付成功  我们会尽快为您发货！</h2>
        <div class="order-info">
          <p>订单号：{{$route.query.sn}}</p>
          <h3 :style="{'margin-bottom': $route.query.hasCoupon == 'true' || $route.query.hasCoupon == true ? '0' : '87px'}">金额：<span class="payment">{{$route.query.payment}}</span> 元</h3>
          <p class="check-order" @click="goHref(`/order/${$route.query.orderId}?source=account`)" v-if="$route.query.hasCoupon == 'true' || $route.query.hasCoupon == true">查看订单</p>
        </div>
        <check-coupon class="check-coupon" v-if="$route.query.hasCoupon == 'true' || $route.query.hasCoupon == true"></check-coupon>
        <div class="button-list" v-if="$route.query.hasCoupon == 'false' || $route.query.hasCoupon == false || !$route.query.hasCoupon" >
          <span class="btn btn-red" @click="goHref('/')">继续逛</span>
          <span class="btn btn-grey" @click="goHref(`/order/${$route.query.orderId}?source=account`)">查看订单</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckCoupon from '~components/check-coupon-pay.vue'
import Pay from '~components/biz/pay'
export default {
  components: {
    [Pay.PayHeader.name]: Pay.PayHeader,
    CheckCoupon
  },
  data () {
    return {
      stepinfo: [{ name: '我的购物车', class: 'active' }, { name: '填写核对订单信息', class: 'active' }, { name: '成功提交订单', class: 'active' }]

    }
  },
  methods: {
    goHref (url) {
      this.$router.push(url)
    }
  },
  mounted () {
    this.$store.commit('common/setBreadCrumbVisibility', false)
    this.$store.commit('common/setShowMainHeader', false)
    this.$store.commit('common/setShowNavigation', false)
  }
}
</script>

<style lang="less">
.wechat-success{

  .success-content{
    display: flex;
    align-items: center;
    justify-content: center;
    .part1{
      text-align: center;
    }
    .check-coupon{
      margin-top: 52px;
      margin-bottom: 87px;
    }
    .button-list{
      margin-top: 31px;
      margin-bottom: 160px;
      .btn{
        width: 140px;
        height: 42px;
        background-color: #ffffff;
        border: solid 1px #ff4544;
        font-size: 16px;
        line-height: 42px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        color: #ff4544;
      }
      .btn-grey{
        border: solid 1px #dddddd;
        color: #999999;
        margin-left: 20px;
      }
    }
    .success-icon{
      width: 54px;
      height: 54px;
      margin: 0 auto;
      margin-top: 80px;
      margin-bottom: 23px;
    }
    .delivery-soon{
      font-size: 18px;
      font-weight: 600;
      color: #333333;
    }
    .order-info,h3{
      margin-top: 21px;
      font-size: 14px;
      line-height: 1.43;
      text-align: center;
      color: #666666;
      .payment{
        font-size: 18px;
        line-height: 1.11;
        color: #333333;
      }
      .check-order{
        margin-top: 22px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>
