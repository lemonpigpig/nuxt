<template lang="html">
  <div class="check-coupon-pay">
    <div class="brown-line">
    </div>
    <div class="coupon-content">
      <!-- <div class="top-header-line">

      </div> -->
      <h1>恭喜您获得优惠券</h1>
      <h3>优惠券将稍后会发放到您的账户</h3>
      <span class="btn btn-home" @click="goUrl('/')">去首页逛逛</span>
      <span class="btn btn-coupon" @click="goUrl('/account/center?source=my-coupon')">查看优惠券</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'check-coupon',
  methods: {
    goUrl (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less">
.check-coupon-pay{
  width: 300px;
  height: 170px;
  .brown-line{
    width: 300px;
    height: 12px;
    border-radius: 8px;
    background-color: #c49f63;
  }
  .coupon-content{
    background: url('~assets/img/quanbg1.png');
    height: 190px;
    width: 260px;
    background-position: center;
    background-size: 100% 100%;
    margin-left: 20px;
    background-repeat: no-repeat;
    margin-top: -5px;
    h1{
      font-size: 20px;
      font-weight: 600;
      padding-top: 20px;
      color: #c49f63;
    }
    h3{
      font-size: 12px;
      color: #999999;
      padding-top: 7px;
    }
    .btn{
      width: 100px;
      height: 40px;
      display: inline-block;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        margin-top: 35px;
        cursor: pointer;
    }
    .btn-home{
        background-color: #c49f63;
        color: white;
    }
    .btn-coupon{
      background-color: #ffffff;
      border: solid 1px #ff4544;
      color: #ff4544;
      box-sizing: border-box;
      margin-left: 20px;
    }
    .top-header-line{
      width: 260px;
       height: 2px;
       background-color: #c49f63;
       box-shadow: 0 2px 8px 0 #210505;
    }
  }
}
</style>
