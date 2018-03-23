<template lang="html">
  <div class="service-info-template">
    <div class="choose-type service-intro">
      <div class="choose-type-title">
        <span>服务介绍</span>
      </div>
      <div class="choose-type-content">
        <span class="service-title">1.仅退款</span>
        <p class="service-content first">申请条件：若您未收到货，或已收到货且与国资商城达成一致不退货仅退款时，请选择“仅退款”选项。</p>
        <p class="service-content">退款流程：1.申请仅退款>2.国资商城同意退款申请>3.退款成功</p>

        <span class="service-title first-span">2.退货退款</span>
        <p class="service-content first">申请条件：若是商品问题，或者不想要了且与国资商城达成一致退货，请选择“退货退款”选项，退货后请保留物流底单。</p>
        <p class="service-content">退款流程：1.申请退货退款>2.国资商城发送退货地址给买家>3.买家退货并填写物流信息>4.卖家确认收货，退款成功。</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
.choose-type{
  width: 1200px;
  height: auto;
  border: 1px solid #f4f4f4;
  margin: 0 auto;
  box-sizing: border-box;
  &-title{
    height: 45px;
    box-sizing: border-box;
    border-bottom: 1px solid #f4f4f4;
    padding-left: 20px;
    span{
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 45px;
    }
  }
  &-content{
    padding: 25px 20px;
    &-div{
      float: left;
      width: 560px;
      cursor: pointer;
      height: 120px;
      border-radius: 4px;
      border: solid 1px #cccccc;
      box-sizing: border-box;
      img{
        width: 50px;
        height: 50px;
        margin: 37px 30px 20px;
        float: left;
      }
    }
  }
}
.service-intro{
  margin-bottom: 207px !important;
  margin-top: 73px !important;
  .choose-type-content{
    .service-title{
      font-size: 14px;
      font-weight: 600;
      line-height: 1.43;
      color: #333333;
    }
    .service-content{
      font-size: 14px;
      line-height: 1.43;
      color: #999999;
    }
    .first{
      margin-top: 10px;
    }
    .first-span{
      display: block;
      margin-top: 41px;
    }
  }
}
</style>
