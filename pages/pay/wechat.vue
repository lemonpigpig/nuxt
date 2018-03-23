<template lang="html">
  <div class="wechat-pay">
    <pay-header  :progressinfo="stepinfo"></pay-header>
    <div class="wechat-content" v-if="!paySuccess">
      <div class="top-content">
        <div class="order-info">
          <span class="order-info-title">订单号：{{$route.query.sn}} <span class="check-detail" @click="goDetail">[查看订单]</span></span>
          <span class="order-info-sub">您的订单提交成功，请在<span class="red">{{orderInfo.timeToPay}}</span>之前完成支付，否则订单会自动取消！</span>
          <span class="product-info">商品名称：<span class="grey" v-for="item in orderInfo.goodsLists">{{item.goodsName}}； </span></span>
          <span class="product-info"><span v-if="orderInfo.isAbholung">提货</span><span v-else>收货</span>信息：<span class="grey">{{orderInfo&&orderInfo.addressInfo&&orderInfo.addressInfo.province}} {{orderInfo&&orderInfo.addressInfo&&orderInfo.addressInfo.city}} {{orderInfo&&orderInfo.addressInfo&&orderInfo.addressInfo.district}} {{orderInfo&&orderInfo.addressInfo&&orderInfo.addressInfo.detail}} {{orderInfo&&orderInfo.telephoneSecurity}} （{{orderInfo&&orderInfo.addressInfo&&orderInfo.addressInfo.name}}）</span></span>
          <span class="product-info" v-if="showWechat">支付状态：<span class="grey">待支付</span></span>
          <span class="product-info" v-if="showWechat">支付方式：<span class="grey">在线支付（{{payWay[payWayIndex].name}}）</span></span>
        </div>
        <div class="pay-price">
          <span class="pay-price-text">应付金额：<span class="pay-price-money">{{orderInfo.orderPayment}}</span>元</span>
        </div>
      </div>
      <div class="choose-pay" v-if="!showWechat && !showAlipay">
        <div class="title">
          请选择支付方式
        </div>
        <div class="content">
          <div class="way-list">
            <div class="way-item icon1" :class="{'border-active':payWay[0].active}" @click="setPayWay(0)">
              <div class="radio-icon" :class="{'radio-grey':!payWay[0].active}">
                <gz-icon icon="radio" v-if="!payWay[0].active" size="15"></gz-icon>
                <gz-icon icon="radio-checked" v-else size="15"></gz-icon>
              </div>
              <gz-icon icon="zhi" size="30"></gz-icon>
                智慧生活卡支付
            </div>
            <div class="way-item icon2" :class="{'border-active':payWay[1].active}" @click="setPayWay(1)">
              <div class="radio-icon" :class="{'radio-grey':!payWay[1].active}">
                <gz-icon icon="radio" v-if="!payWay[1].active" size="15"></gz-icon>
                <gz-icon icon="radio-checked" v-else size="15"></gz-icon>
              </div>
              <gz-icon icon="alipay" size="80"></gz-icon>
            </div>
            <div class="way-item icon3" :class="{'border-active':payWay[2].active}" @click="setPayWay(2)">
              <div class="radio-icon" :class="{'radio-grey':!payWay[2].active}">
                <gz-icon icon="radio" v-if="!payWay[2].active" size="15"></gz-icon>
                <gz-icon icon="radio-checked" v-else size="15"></gz-icon>
              </div>
              <gz-icon icon="wechat-pay" size="30"></gz-icon>
                微信支付
            </div>

            <div class="way-item icon1" :class="{'border-active':payWay[3].active}" @click="setPayWay(3)">
              <div class="radio-icon klt-icon" :class="{'radio-grey':!payWay[3].active}">
                <gz-icon icon="radio" v-if="!payWay[3].active" size="15"></gz-icon>
                <gz-icon icon="radio-checked" v-else size="15"></gz-icon>
              </div>
              <img src="~assets/img/klt.jpg" style="width: 68px;" alt="">
              <!-- <gz-icon icon="zhi" size="30"></gz-icon> -->
                开联通皮影卡
            </div>
          </div>
          <button class="btn btn-red" @click="showPay">立即支付 </button>
        </div>
      </div>

      <!-- wechat-pay -->
      <div class="bottom-content" v-if="showWechat">
        <div class="qcrode">
          <div class="img">
            <img :src="qcrodeImg" alt="">
          </div>
          <!-- <div class="pay-button" @click="showPay" :class="{'btn-disable':counter}">
            {{counter? counter + 's后' : ''}}重新获取二维码
          </div> -->
        </div>
        <div class="wechat-img">
          <img src="~assets/img/wechatpay.jpg" alt="">
        </div>
      </div>
  <!-- ali-pay -->
      <div class="ali-pay" v-if="showAlipay">
        <div class="ali-pay-price">
          {{orderInfo.orderPayment}}
        </div>
        <div class="ali-pay-img">
          <img :src="qcrodeImg" alt="">
        </div>
      </div>

      <a class="choose-pay-way" @click="showPayWay" v-if="showWechat || showAlipay">选择其他支付方式>></a>
    </div>
    <div class="pay-success" v-if="paySuccess">
      <img src="~assets/img/Group122.png" alt="">
      <h3>支付成功  我们会尽快为您发货！</h3>
      <p>订单号：{{$route.query.sn}}</p>
      <p>金额：<span>{{orderInfo.orderPayment}}</span>元</p>
      <a class="pay-success-btn first">继续逛</a>
      <a class="pay-success-btn">查看订单</a>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Pay from '~components/biz/pay'

export default {
  components: {
    [Pay.PayHeader.name]: Pay.PayHeader
  },
  beforeRouteLeave (to, from, next) {
    next()
  },
  data () {
    return {
      stepinfo: [{ name: '我的购物车', class: 'active' }, { name: '填写核对订单信息', class: 'active' }, { name: '成功提交订单', class: 'active' }],
      orderInfo: {},
      qcrodeImg: '',
      showWechat: false,
      showAlipay: false,
      payWayIndex: 0,
      counter: 5,
      clearInterval: false,
      paySuccess: false,
      payWay: [
        {
          name: '开联通皮影卡',
          active: true,
          value: 6,
          icon: 'zhi'
        },
        {
          name: '支付宝支付',
          value: 5,
          active: false,
          icon: 'alipay'
        },
        {
          name: '微信支付',
          active: false,
          value: 4,
          icon: 'wechat-pay'
        },
        {
          name: '智慧生活卡支付',
          active: false,
          value: 8,
          icon: 'wechat-pay'
        }
      ]
    }
  },
  computed: {
    orderSn () {
      return this.$store.state.order.orderSn
    }
  },
  mounted () {
    this.$store.commit('common/setBreadCrumbVisibility', false)
    this.$store.commit('common/setShowMainHeader', false)
    this.$store.commit('common/setShowNavigation', false)
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('order/getPayInfo', this.$route.query.sn).then((data) => {
        let timeToPay = ''
        if (data.isActivity || data.isPresale) {
          timeToPay = moment(data.createTime).add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        } else {
          timeToPay = moment(data.createTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        data.timeToPay = timeToPay
        data.telephoneSecurity = `${data.addressInfo.telephone.slice(0, 3)}****${data.addressInfo.telephone.slice(7, 11)}`
        this.$set(this, 'orderInfo', Object.assign({}, data))
      })
    },
    goDetail () {
      this.$router.push(`/order/${this.orderInfo.orderId}?source=account`)
    },
    showPay () {
      this.qcrodeImg = ''
      this.clearInterval = false
      if (this.payWayIndex === 0 || this.payWayIndex === 3) {
        this.$router.push({
          path: '/pay/smartPay',
          query: {
            sn: this.$route.query.sn,
            type: this.payWay[this.payWayIndex].value
          }
        })
      } else {
        this.$store.dispatch('order/payOrder', {
          Sn: this.$route.query.sn,
          PaymentType: this.payWay[this.payWayIndex].value,
          ReturnUrl: '',
          CancelUrl: ''
        }).then((data) => {
          if (this.payWayIndex === 0) {
            location.href = data.data
          } else if (this.payWayIndex === 2 || this.payWayIndex === 1) {
            if (this.payWayIndex === 1) {
              this.showAlipay = true
            } else {
              this.showWechat = true
            }
            this.qcrodeImg = data.data
            // this.counter = 5
            this.setOneMinInterval()
          }
        })
      }
    },
    setOneMinInterval () {
      const timer = setInterval(() => {
        // this.counter -= 1
        if (this.$route.name !== 'pay-wechat' || this.clearInterval) {
          clearInterval(timer)
          return
        }
        this.$store.dispatch('order/getPayResult', this.$route.query.sn).then((data) => {
          if (data.status === 2) {
            clearInterval(timer)
            this.paySuccess = true
            this.$router.push({
              path: '/pay/success',
              query: {
                sn: this.$route.query.sn,
                payment: this.orderInfo.orderPayment,
                orderId: this.orderInfo.orderId,
                hasCoupon: data.hasCoupon
              }
            })
          }
        })
        // if (this.counter === 0) {
        //   clearInterval(timer)
        // }
      }, 1000)
    },
    showPayWay () {
      this.showWechat = false
      this.showAlipay = false
      this.clearInterval = true
    },
    setPayWay (index) {
      this.payWayIndex = index
      for (let i = 0; i < this.payWay.length; i += 1) {
        this.$set(this.payWay[i], 'active', false)
      }
      this.$set(this.payWay[index], 'active', true)
    }
  }
}
</script>

<style lang="less">
.wechat-pay{
  margin-bottom: 207px;
  .btn-disable{
    background: #dddddd;
    cursor: not-allowed;
  }
  .border-active{
    border: solid 2px #ff4544 !important;
    background-position: 100% 100%;
    background-image: url('~assets/img/trangleRight.png');
    background-repeat: no-repeat;
  }
  .pay-success{
    text-align: center;
    img{
      margin-top: 80px;
      width: 54px;
      height: 54px;
    }
    h3{
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      margin-top: 23px;
      margin-bottom: 23px;
    }
    p{
      font-size: 14px;
      line-height: 1.43;
      color: #666666;
      span{
        font-size: 18px;
      }
    }
    .pay-success-btn{
      cursor: pointer;
      display: inline-block;
      width: 140px;
      height: 42px;
      text-align: center;
      line-height: 42px;
      color: #999999;
      box-sizing: border-box;
      font-size: 16px;
      margin-top: 31px;
      border: 1px solid #dddddd;
    }
    .first{
      margin-right: 20px;
    }
    .pay-success-btn:hover{
      border: 1px solid #ff4544;
      color: #ff4544;
      text-decoration: none;
    }
  }
  .wechat-content{
    width: 1200px;
    margin: 0 auto;
    margin-top: 37px;
    .choose-pay-way{
      font-size: 16px;
      font-weight: 300;
      color: #ff4544;
      cursor: pointer;
      padding-bottom: 4px;
      border-bottom: 1px solid #ff4544;
    }
    a.choose-pay-way:hover{
      text-decoration: none;
    }
    .top-content{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .order-info{
        .order-info-title{
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          .check-detail{
            font-size: 14px;
            color: #ff4544;
            margin-left: 23px;
            font-weight: 300;
            cursor: pointer;
          }
        }
        .product-info{
          font-weight: 600;
          color: #333333;
          display: block;
          font-size: 14px;
          max-width: 900px;
          .grey{
            color: #999999;
            font-weight: 300;
          }
        }
        .order-info-sub{
          margin-top: 14px;
          display: block;
          font-size: 14px;
          font-weight: 300;
          margin-bottom: 11px;
          color: #999999;
          .red{
            color: #ff4544;
          }
        }
      }
      .pay-price{
        .pay-price-text{
          font-size: 16px;
          font-weight: 300;
          color: #333333;
        }
        .pay-price-money{
          font-size: 28px;
          font-weight: 600;
          color: #ff4847;
        }
      }
    }
    .choose-pay{
        margin-top: 37px;
      .title{
        width: 100%;
        background-color: #ff4544;
        height: 42px;
        box-sizing: border-box;
        line-height: 42px;
        padding-left: 9px;
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
      }
      .content{
        display: flex;
        justify-content: space-between;
        margin-top: 39px;
        .way-list{
          display: flex;
          .way-item{
            margin-right: 20px;
            width: 181px;
            cursor: pointer;
            display: flex;
            align-items: center;
            height: 50px;
            box-sizing: border-box;
            border: 1px solid #dddddd;
            font-size:12px;color:#666666;
            .radio-icon{
              .gz-icon{
                color: #ff4544;
                margin-left: 10px;
                margin-right: 15px;
              }
            }
            .klt-icon{
              .gz-icon{
                  margin-right: 6px !important;
              }
            }
            .radio-grey{
              .gz-icon{
                color: #dddddd;
              }
            }
          }
          .icon1{
             .gz-icon{
               color: #ff4544;
               margin-right: 5px;
             }
          }
          .icon2{
             .gz-icon{
               margin-left: 20px;
               color: #25abee;
             }
          }
          .icon3{
              font-size: 16px;
             .gz-icon{
               color: #00b700;
               margin-left: 20px;
               margin-right: 5px;
             }
          }
        }
        .btn{
          width: 180px;
          height: 50px;
          color: white;
          outline: none;
          border: none;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.5;
          color: #ffffff;
        }
        .btn-red{
          background-color: #ff4544;
        }
      }
    }
    .ali-pay{
      margin: 0 auto;
      width: 516px;
      height: 378px;
      position: relative;
      background: url('~assets/img/zhi.jpg');
      .ali-pay-price{
        font-size: 26px;
        color: #FF4600;
        font-weight: 600;
        left: 102px;
        top: 50px;
        position: absolute;
      }
      .ali-pay-img{
        width: 168px;
        height: 168px;
        position: absolute;
        top: 107px;
        left: 66px;
      }
    }
    .bottom-content{
      display: flex;
      margin-top: 49px;
      align-items: center;
      justify-content: center;
      .qcrode{
          width: 180px;
        .pay-button{
            width: 136px;
            height: 30px;
            border: solid 1px #dddddd;
            font-size: 14px;
            line-height: 30px;
            text-align: center;
            color: #666666;
            font-weight: 300;
            cursor: pointer;
            margin: 0 auto;
            margin-top: 10px;
        }
        .img{
          width: 180px;
          height: 180px;
        }
      }
      .wechat-img{
        width: 308px;
        height: 378px;
        margin-left: 127px;
      }
    }
  }
}
</style>
