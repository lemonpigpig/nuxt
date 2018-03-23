<template lang="html">
  <div class="smart-pay">
    <div class="pay-header">
      <div class="content">
        <div class="left">
          <div class="icon">
            <gz-icon size="40" icon="zhi"></gz-icon>
          </div>
          <div class="card-name">
            <span class="line1">{{$route.query.type == 6 ? '智慧生活卡支付' : '开联通皮影卡'}}</span>
            <span class="line2">便捷支付一卡通</span>
          </div>
        </div>
        <div class="right">
          <span>客服热线：400-022-7299</span>
          <!--      丨     意见反馈  -->
        </div>
      </div>
    </div>

    <!-- <div class="pay-success" v-if="true"> -->
    <div class="pay-success" v-if="!notPay && paySuccess">
      <div class="success-content">
        <div class="success-icon">
          <img src="~assets/img/Group122.png" alt="">
        </div>
        <h2 class="delivery-soon">支付成功  我们会尽快为您发货！</h2>
        <div class="order-info" v-if="!hasCoupon">
          <p>您已经支付成功，<span class="payment">{{counter}}</span>秒后页面自动跳转，<span class="payment" @click="goHref(`/order/${orderInfo.orderId}?source=account`)">点击这里</span> 直接跳转</p>
        </div>
        <div style="margin-left:10px;margin-top:20px;" v-if="hasCoupon">
          <check-coupon class="check-coupon"></check-coupon>
        </div>

      </div>
    </div>


    <div class="pay-success pay-fail" v-if="!notPay && !paySuccess">
      <div class="success-content">
        <div class="success-icon">
          <img src="~assets/img/Group123.png" alt="">
        </div>
        <h2 class="delivery-soon">支付失败  请重新支付</h2>
        <div class="order-info">
          <p>该订单会为您保留{{(orderInfo.isActivity || orderInfo.isPresale) ? '15分钟' : '24小时'}} 至{{orderInfo.timeToPay}}（从下单之日算起）</p>
          <p>{{(orderInfo.isActivity || orderInfo.isPresale) ? '15分钟' : '24小时'}}之后如果还未付款，系统将自动取消该订单。</p>
        </div>
        <div class="button-list">
          <span class="btn btn-red" @click="rePay">重新支付</span>
          <span class="btn btn-grey" @click="goHref(`/order/${orderInfo.orderId}?source=account`)">查看订单</span>
        </div>
        <h4 class="safe-alert"><gz-icon icon="info" size="14"/>  安全提醒：国资商城不会以任何理由要求您提供银行卡信息或支付额外费用，请谨防钓鱼链接或诈骗电话。</h4>
      </div>
    </div>

  <!-- <div class="pay-content" v-if="false"> -->
    <div class="pay-content" v-if="notPay">
      <div class="pay-left">
        <div class="title">
          我的订单
        </div>
        <div class="detail">
          <span class="detail-text">商户名称：国资商城</span>
          <span class="detail-text">订 单 号：{{$route.query.sn}}</span>
          <span class="detail-text">创建时间：{{orderInfo.createTime && orderInfo.createTime.replace('T', ' ')}}</span>
          <span class="detail-text">订单金额：<span class="price" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{payment}}</span></span>
        </div>
      </div>
      <div class="pay-right">
        <div class="title">
          账号支付
        </div>
        <div class="content">
          <div class="pay-input" :class="{'pay-error':verifyState.cardNumber.state}">
            卡  号： <input v-model="cardNumber" type="text" @blur="verifyFun('cardNumber')"  placeholder="">
            <span class="error" v-if="verifyState.cardNumber.state">{{verifyState.cardNumber.msg}}</span>
          </div>
          <div class="pay-input" :class="{'pay-error':verifyState.password.state}" >
            密  码： <input  v-model="password" type="password" @blur="verifyFun('password')"   placeholder="">
            <span class="error" v-if="verifyState.password.state">{{verifyState.password.msg}}</span>
          </div>
          <div class="pay-input" :class="{'pay-error':verifyState.verifyCode.state}">
            验证码： <input v-model="verifyCode" type="text" @blur="verifyFun('verifyCode')"  placeholder="输入验证码">
            <img @click="refreshImg" :src="`data:image/jpeg;base64,${imgVerifyInfo.img}`" alt="" class="ver-img">
            <span class="error" v-if="verifyState.verifyCode.state">{{verifyState.verifyCode.msg}}</span>
          </div>
          <div class="buy-button">
            <button class="btn btn-red" @click="confirmPay">确认付款</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import CheckCoupon from '~components/check-coupon-pay.vue'
export default {
  components: {
    CheckCoupon
  },
  data () {
    return {
      cardNumber: '',
      password: '',
      verifyCode: '',
      orderInfo: {},
      imgVerifyInfo: {},
      notPay: true,
      paySuccess: false,
      counter: 5,
      payment: '',
      hasCoupon: false,
      verifyState: {
        cardNumber: {
          state: false,
          msg: '卡号输入错误，请重新输入'
        },
        password: {
          state: false,
          msg: '请输入密码'
        },
        verifyCode: {
          state: false,
          msg: '请输入验证码'
        }
      }
    }
  },
  watch: {
    orderInfo: {
      deep: true,
      handler (val) {
        this.$set(this, 'payment', val.orderPayment)
      }
    }
  },
  mounted () {
    this.$store.commit('common/setShowMainHeader', false)
    this.$store.commit('common/setShowNavigation', false)
    this.$store.commit('common/setShowTopHeader', false)
    this.fetchData()
    this.getVerifyImg()
  },
  methods: {
    verifyFun (type) {
      if (this[type] === '') {
        this.verifyState[type].state = true
      } else {
        this.verifyState[type].state = false
      }
    },
    getVerifyImg () {
      this.$store.dispatch('authorization/getImgVerify').then((data) => {
        this.$set(this, 'imgVerifyInfo', Object.assign({}, data.data))
      })
    },
    goHref (url) {
      this.$router.push(url)
    },
    rePay () {
      this.notPay = true
      this.cardNumber = ''
      this.password = ''
      this.verifyCode = ''
      this.getVerifyImg()
    },
    refreshImg () {
      this.getVerifyImg()
    },
    set5secInterval () {
      const timer = setInterval(() => {
        this.counter -= 1
        if (this.counter === 0) {
          clearInterval(timer)
          this.$router.push(`/order/${this.orderInfo.orderId}?source=account`)
        }
      }, 1000)
    },
    confirmPay () {
      const queryCondition = {
        'Sn': this.$route.query.sn,
        'PaymentType': 6,
        'Account': this.cardNumber,
        'PassWord': this.password,
        'Captcha': this.verifyCode,
        'CodeToken': this.imgVerifyInfo.session
      }

      if (this.cardNumber === '' || this.verifyCode === '' || this.password === '') {
        return
      }
      const temp = this.$route.query.type === 8 ? 'order/confirmPayment' : 'order/confirmPosPayment'
      this.$store.dispatch(temp, queryCondition).then((data) => {
        if (data.status === 2) {
          this.notPay = false
          this.paySuccess = true
          this.hasCoupon = data.hasCoupon
          if (!data.hasCoupon) {
            this.set5secInterval()
          }
        }
      }).catch((err) => {
        if (err.code === '1015') {
          this.verifyState.verifyCode.state = true
          this.verifyState.verifyCode.msg = '验证码输入错误'
          this.getVerifyImg()
          return
        }

        if (err.code === '13012') {
          this.verifyState.cardNumber.msg = '卡号格式不对'
          return
        }
        this.paySuccess = false
        this.notPay = false
        // this.$notify({ message: err.msg || err })
      })
    },
    fetchData () {
      this.$store.dispatch('order/getPayInfo', this.$route.query.sn).then((data) => {
        let timeToPay = ''
        if (data.isActivity || data.isPresale) {
          timeToPay = moment(data.createTime).add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        } else {
          timeToPay = moment(data.createTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        data.timeToPay = timeToPay
        this.$set(this, 'orderInfo', Object.assign({}, data))
        this.$set(this, 'payment', data.orderPayment)
      })
    }
  }
}
</script>

<style lang="less">
body,
html {

    .smart-pay {
        padding-bottom: 78px;
        background: #f4f4f4;
        .pay-header {
            height: 100px;
            width: 100%;
            background: white;
            .content {
                width: 1200px;
                height: 100%;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .right{
                  font-size: 16px;
                  font-weight: 500;
                  color: #666666;
                }
                .left {
                    display: flex;
                    align-items: center;
                    .icon {
                        display: flex;
                        align-items: center;
                        width: 40px;
                        height: 34px;
                        color: #ff4544;
                    }
                    .card-name{
                      height: 42px;
                      border-left: 1px solid #d8d8d8;
                      padding-left: 10px;
                      margin-left: 10px;
                      box-sizing: border-box;

                      .line1{
                        display: block;
                        font-size: 16px;
                        font-weight: 600;
                        color: #333333;
                      }
                      .line2{
                        font-size: 14px;
                        color: #939393;
                      }
                    }
                }
            }
        }
        .pay-success{
          display: flex;
          margin-bottom: 160px;
          align-items: center;
          justify-content: center;
          .success-content{
            text-align: center;
          }
          .success-icon{
            width: 54px;
            height: 54px;
            margin: 0 auto;
            margin-top: 260px;
            margin-bottom: 23px;
          }
          .button-list{
            margin-top: 31px;
            margin-bottom: 44px;
            .btn{
              width: 140px;
              height: 42px;
              background-color: transparent;
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
          .safe-alert{
            font-size: 12px;
            font-weight: 300;
            color: #999999;
          }
          .order-info{
            margin-top: 21px;
            font-size: 14px;
            line-height: 1.43;
            text-align: center;
            color: #666666;
            .payment{
              color: #ff4544;
              cursor: pointer;
            }
          }
          .delivery-soon{
            font-size: 18px;
            font-weight: 600;
            color: #333333;
          }
        }
        .pay-content{
          width: 740px;
          height: 400px;
          margin: 0 auto;
          margin-top: 185px;
          background: white;
          box-sizing: border-box;
          padding-left: 43px;
          padding-top: 30px;
          display: flex;

          .title{
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            padding-left: 5px;
            border-left: 4px solid #ff4544;
          }
          .pay-left{
            width: 272px;
            .detail{
              box-sizing: border-box;
              padding-top: 35px;
              height: 320px;
              border-right: 2px solid #eeeeee;
              .detail-text{
                display: block;
                margin-left: 9px;
                font-size: 14px;
                line-height: 1.57;
                color: #666666;
                margin-bottom: 18px;
                .price{
                  font-size: 22px;
                   line-height: 1;
                   color: #333333;
                }
              }
            }
          }
          .pay-right{
            box-sizing: border-box;
            padding-left: 67px;
            .content{
              margin-top: 24px;
              .btn{
                width: 300px;
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
              .pay-error{
                  border: solid 1px #ff4544 !important;
              }
              .pay-input{
                margin-bottom: 31px;
                width: 300px;
                height: 40px;
                border: solid 1px #dddddd;
                box-sizing: border-box;
                padding-left: 9px;
                line-height: 40px;
                position: relative;
                font-size: 14px;
                color: #666666;
                .error{
                  height: 14px;
                  line-height: 14px;
                  margin-top: 5px;
                  display: block;
                  font-size: 12px;
                  color: #ff4544;
                }
                .ver-img{
                  width: 80px;
                  height: 38px;
                  position: absolute;
                  right: 0;
                  cursor: pointer;
                }
                input{
                  width: 210px;
                  border: none;
                  height: 28px;
                }
              }
            }
          }
        }
    }
}
</style>
