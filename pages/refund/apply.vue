<template lang="html">
  <div class="apply-refund">

    <div class="choose-type">
      <div class="choose-type-title">
        <span>选择服务类型</span>
      </div>
      <div class="choose-type-content">
        <div class="choose-type-content-div only-refund" :class="{'active' : onlyRefund == true}" @click="goProgress(true)">
          <img src="~static/img/only-refund.svg" alt="">
          <div class="content-right">
            <span class="title">仅退款</span>
            <span class="sub-title">未收到货(包含未签收),或协商同意前提下</span>
          </div>
        </div>
        <div class="choose-type-content-div with-goods" @click="goProgress(false)" :class="{'active' : onlyRefund == false}">
          <img src="~static/img/with-goods.svg" alt="">
          <div class="content-right">
            <span class="title active-word">退货退款</span>
            <span class="sub-title">已收到货,需要退已收到的货物</span>
          </div>
        </div>
        <div class="clear-float"></div>
      </div>
    </div>

    <div class="refund-goods-content">
      <div class="refund-goods-content-title">
        <span class="order-sn" v-if="preRmaDetail && preRmaDetail.orderSn"><span class="order-sn-title">订单编号：</span>{{preRmaDetail.orderSn}}</span>
        <span class="goods-num">数量</span>
        <span class="goods-price">单价</span>
      </div>
      <div class="refund-goods-content-goods" >
        <div class="goods-list" v-for="item in preRmaDetail.goodsList">
          <div class="goods-info">
            <img :src="item.image" alt="">
            <p class="goods-title">
              {{item.goodsName}}
            </p>
            <div class="clear-float"></div>
          </div>
          <div class="goods-num">
            <span class="num">X{{item.quantity}}</span>
          </div>
          <div class="goods-price">
            <span>¥{{Number(item.payPrice).toFixed(2)}}</span>
          </div>
          <div class="clear-float"></div>
        </div>
        <div style="position:relative" v-if="preRmaDetail && preRmaDetail.giftList && preRmaDetail.giftList.length">
          <div style="float: left">
            <div class="gift-package" v-if="preRmaDetail && preRmaDetail.giftList && preRmaDetail.giftList.length > 1">
              赠品礼包
            </div>
            <div class="goods-list gift-list" v-for="item in preRmaDetail.giftList">
              <div class="goods-info">
                <img :src="item.image" alt="">
                <p class="goods-title">
                  <span class="gift-good" v-if="item.itemType == 2">赠品</span>
                  {{item.goodsName}}
                </p>
                <div class="clear-float"></div>
              </div>
              <div class="goods-num">
                <span class="num">X{{item.quantity}}</span>
              </div>
              <div class="goods-price">
                <span>¥{{Number(item.payPrice).toFixed(2)}}</span>
              </div>
              <div class="clear-float"></div>
            </div>
          </div>
          <div class="operate-bar" v-if="$route.query.orderStatus != 3">
            <span class="opreate-btn first-btn " :class="{'border-active': withGoods}" @click="withGoods = true">附加赠品一并退款</span>
            <span class="opreate-btn" :class="{'border-active': !withGoods}" @click="withGoods = false">不退赠品</span>
            <p>*赠品随此商品附送，如不退回赠品，退款将扣除赠品原价</p>
          </div>
          <div class="clear-float"></div>
        </div>
      </div>
    </div>
    <service-info></service-info>
  </div>
</template>

<script>
import ServiceInfo from '~components/biz/refund/service-info.vue'
export default {
  mounted () {
    this.$store.commit('common/setBreadCrumbVisibility', true)
    this.$store.commit('common/setBreadCrumbList', [{
      name: '国资商城',
      url: '/'
    }, {
      name: '申请退款'
    }])
    this.$store.commit('common/setShowNavigation', false)
    const param = {
      orderId: this.$route.query.orderId,
      goodsId: this.$route.query.goodsId === 'null' ? null : this.$route.query.goodsId
    }
    this.$store.dispatch('rma/getPreRmaDetail', param).then((data) => {
      data.data.giftList = []
      data.data.goodsList = []
      data.data.items.forEach((item) => {
        if (item.itemType === 2) {
          data.data.giftList.push(item)
        } else {
          data.data.goodsList.push(item)
        }
      })
      this.$set(this, 'preRmaDetail', Object.assign({}, data.data))
    }).catch(() => {
      this.$router.go(-1)
    })
  },
  data () {
    return {
      onlyRefund: 'null',
      preRmaDetail: {},
      withGoods: true
    }
  },
  components: {
    ServiceInfo
  },
  methods: {
    goProgress (type) {
      if (this.$route.query.orderStatus === '3' && !type) {
        this.$store.commit('common/setMessage', '未发货订单不能选择退货申请')
        return
      }
      this.onlyRefund = type
      this.$router.push(`/refund/progress?orderId=${this.$route.query.orderId}&goodsId=${this.$route.query.goodsId}&type=${type ? 1 : 2}&withGoods=${this.withGoods ? 1 : 0}`)
    }
  }
}
</script>

<style lang="less">
.clear-float{
  clear:both;
}
.apply-refund{
  width: 100%;
  margin-top: -27px;
  .gift-package{
    width: 82px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    margin-bottom: 19px;
    background-color: #ff4544;
    color: #ffffff;
    font-size: 12px;
  }
  .refund-goods-content{
    width: 1200px;
    margin: 0 auto;
    margin-top: 39px;
    box-sizing: border-box;
    border: solid 1px #f4f4f4;
    &-title{
      height: 36px;
      box-sizing: border-box;
      padding-left: 20px;
      background-color: #f4f4f4;
      span{
        display: inline-block;
        line-height: 36px;
        font-size: 12px;
        color: #333333;
      }
      .goods-price{
        margin-left: 85px;
        text-align: center;
        width: 80px;
      }
      .goods-num{
        width: 40px;
        text-align: center;
      }
      .order-sn{
        width: 580px;
        &-title{
          color: #999;
        }
      }
    }
    &-goods{
      padding: 30px 20px;
      .goods-list{
        margin-bottom: 28px;
      }
      .goods-list:last-child{
        margin-bottom: 0;
      }
      .goods-info{
        float: left;
        width: 580px;
        img{
          width: 82px;
          height: 82px;
          border: 1px solid #f4f4f4;
          float: left;
        }
        p.goods-title{
          margin: 23px 20px 0;
          font-size: 12px;
          line-height: 1.5;
          color: #333333;
          max-width: 354px;
          display: inline-block;
          span.gift-good{
            font-size: 12px;
            color: white;
            background: #ff4544;
            padding: 3px;
            font-weight: 300;
          }
        }
      }
      .goods-num{
        width: 40px;
        display: inline-block;
        text-align: center;
        .num{
          font-size: 12px;
          line-height: 82px;
          color: #999999;
        }
      }
      .operate-bar{
        display: inline-block;
        margin-left: 55px;
        position: absolute;
        top: 50%;
        margin-top: -50px;
        p{
          font-size: 12px;
          color: #999999;
        }
        .border-active{
          border: solid 2px #ff4544 !important;
          background-position: 100% 100%;
          background-image: url('~assets/img/trangleRight.png');
          background-repeat: no-repeat;
        }
        .first-btn{
          margin-right: 24px;
        }
        .opreate-btn{
          font-size: 14px;
          color: #333333;
          border: solid 1px #dddddd;
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          display: inline-block;
          cursor: pointer;
        }
      }
      .goods-price{
        margin-left: 85px;
        display: inline-block;
        text-align: center;
        width: 80px;
        span{
          font-size: 14px;
          font-weight: 600;
          line-height: 82px;
          color: #333333;
        }
      }
    }
  }
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
        .content-right{
          margin: 37px 0;
          .title{
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            display: block;
          }
          .sub-title{
            font-size: 16px;
            font-weight: 600;
            color: #999999;
          }
          .active-word{
            color: #ff5502;
          }
        }
      }
      .only-refund{

      }
      .with-goods{
        margin-left: 38px;
      }
      .active{
         border: solid 1px #ff4544;
      }
    }
  }
}
</style>
