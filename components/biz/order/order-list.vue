<template lang="html">
  <div class="order-list">
    <div class="tab-bar" v-if="$route.query.type != 3">
      <div class="nav-list" v-for="(item,index) in typeList">
          <span @click="setActive(index, item.id)" class="nav" :class="{'active':item.active}">{{item.name}}</span>
      </div>
    </div>
    <div class="goods-list">
      <div class="goods-list-title" v-if="$route.query.type != 3">
        <!--   -->
        <div style="width: 679px;display:flex;">
          <span class="title-span order-info " >订单信息</span>
          <span class="title-span order-num" >数量</span>
          <span class="title-span order-price" >单价</span>
        </div>
        <span class="title-span total-price" >总金额</span>
        <span class="title-span oprate" >操作</span>
      </div>

      <div class="goods-list-content" v-for="item in orders.itemList">
        <span class="title">下单时间：{{item.createTime.replace('T', ' ')}}   订单编号：{{item.sn}}</span>
        <div class="pay-alert" v-if="item.payNow">
          <span class="pay-word"><img src="~assets/img/Group 125.png" style="width: 16px;margin-right:14px;"/> 您的订单提交成功，请在 <span class="red">{{item.timeToPay}}</span> 前完成支付，超时订单将自动取消！</span>
        </div>
        <div class="pay-alert" v-if="item.cancelBySystem">
          <span class="pay-word"><img src="~assets/img/Group 125.png" style="width: 16px;margin-right:14px;"/>订单超时已自动取消</span>
        </div>
        <div class="content">
          <div class="content-left">
            <div class="order-item" v-for="(child,childindex) in item.order" >
              <div class="goods-title-bar" v-if="item.order.length > 1">
                <span class="name">包裹{{childindex+1}}</span>
                <span class="num">{{child.totalQuantity}}件</span>
                <span class="line3-list" v-if="child.orderStatus == 1">待付款</span>
                <span class="line3-list" v-if="child.orderStatus == 2 || child.orderStatus == 3  ">
                  <span v-if="child.isAbholung">待自提</span>
                  <span v-else>待发货</span>
                </span>
                <span class="line3-list" v-if="child.orderStatus == 4 ">
                  <span v-if="child.isAbholung">待自提</span>
                  <span v-else>待收货</span>
                </span>
                <span class="line3-list" v-if="child.orderStatus == 5 ">已完成</span>

                <span class="line3-list apply-refund-order-1" v-if="child.orderStatus == 3 && item.order.length > 1 && child.isInRmaPeriod && child.goodsLists[0].rmaStatus == 10">待审核</span>
                <span class="line3-list apply-refund-order-1" v-if="child.orderStatus == 3 && item.order.length > 1 && child.isInRmaPeriod && child.goodsLists[0].rmaStatus == 20 && child.goodsLists[0].rmaType == 2">待用户退货</span>
                <span class="line3-list apply-refund-order-1" v-if="child.orderStatus == 3 && item.order.length > 1 && child.isInRmaPeriod && (child.goodsLists[0].rmaStatus > 25 && child.goodsLists[0].rmaStatus < 40 || (child.goodsLists[0].rmaStatus == 20 && child.goodsLists[0].rmaType == 1))">处理中</span>
                <span class="line3-list apply-refund-order-1" v-if="child.orderStatus == 3 && item.order.length > 1 && child.isInRmaPeriod && child.goodsLists[0].rmaStatus == 40">已退款</span>

                <span class="line3-list apply-refund-order-1" v-if="child.orderStatus == 3 && item.order.length > 1 && child.isInRmaPeriod && (child.goodsLists[0].rmaStatus == null || child.goodsLists[0].rmaStatus == 25 || child.goodsLists[0].rmaStatus == 50 || child.goodsLists[0].rmaStatus == 60)" @click="applyRefund(child)">申请退款</span>
                <span class="line3-list" v-if="child.orderStatus == 6 || child.orderStatus == 7 || child.orderStatus == 8">已取消</span>
              </div>

              <div class="goods-content" v-for="grand in child.goodsLists">
                <!-- -->
                <div  class="product-info" style="width:596px;cursor:pointer" @click="goGoodsDetail(grand)">
                  <img :src="grand.goodsImage" alt="">
                  <span>
                    <!-- <span class="pre-sale-tag" v-if="child.isPresale">预售</span> -->
                    <gz-tag backgroundColor="#fe8d00" class="tag-item-order" v-if="child.isPresale">
                      <span slot="tag-text">预售</span>
                    </gz-tag>
                    <gz-tag backgroundColor="#555c78" class="tag-item-order" v-if="child.isAbholung">
                      <span slot="tag-text">自提</span>
                    </gz-tag>
                    <gz-tag backgroundColor="#ff4544" class="tag-item-order" v-if="grand.itemType === 2">
                      <span slot="tag-text">赠品</span>
                    </gz-tag>
                    {{grand.goodsName}}
                    <div class="pre-sale-bar" v-if="child.isPresale">
                      <!-- <gz-icon icon="warn" size="16"></gz-icon> -->
                      <gz-icon icon="info1" size="16"/></gz-icon>
                      预计 {{child.presaleTime}}发货
                    </div>
                  </span>
                </div>
                <!--  -->
                <div class="goods-num" style="width:100px;">
                  X{{grand.quantity}}
                </div>
                <!--  -->
                <div class="goods-price" style="width:100px;text-align: center;">
                  <div class="">
                    <span class="price">¥{{(Number(grand.totalPrice)/Number(grand.quantity)).toFixed(2)}}</span>
                    <a class="refund-status" @click="applyRefund(child, grand)" v-if="(grand.rmaStatus == null || grand.rmaStatus == 60 || grand.rmaStatus == 50 || grand.rmaStatus == 25) && grand.itemType !== 2 && (child.orderStatus == 4 || child.orderStatus == 5) && child.isInRmaPeriod">申请退款</a>
                    <a class="refund-status not-click" v-if="grand.rmaStatus == 10 && (child.orderStatus == 4 || child.orderStatus == 5) && grand.itemType !== 2">待审核</a>
                    <a class="refund-status not-click" v-if="(grand.rmaStatus == 20 && grand.rmaType == 2) && (child.orderStatus == 4 || child.orderStatus == 5) && grand.itemType !== 2">待用户退货</a>
                    <a class="refund-status not-click" v-if="(grand.rmaStatus > 25 && grand.rmaStatus < 40 || (grand.rmaStatus == 20 && grand.rmaType == 1)) && (child.orderStatus == 4 || child.orderStatus == 5) && grand.itemType !== 2">处理中</a>
                    <a class="refund-status  not-click alread-refund" v-if="grand.rmaStatus == 40 && (child.orderStatus == 4 || child.orderStatus == 5) && grand.itemType !== 2">已退款</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-right">
            <div class="goods-total-price">
              <div class="">
                <span class="price">¥{{(Number(item.totalPrice) + Number(item.freight)).toFixed(2)}}</span>
                <span class="shipping-price">(含运费：¥{{item.freight}})</span>
              </div>
            </div>
            <div class="goods-oprate">
              <div class="">
                <a class="goods-oprate-state" v-if="item.order[0].orderStatus > 5 && item.order.length === 1">已取消</a>
                <a class="goods-oprate-state" v-if="(item.order[0].orderStatus == 2 || item.order[0].orderStatus == 3) && item.order.length === 1">
                  <span v-if="item.order[0].isAbholung">待自提</span>
                  <span v-else>待发货</span>
                </a>
                <!-- <a v-if="item.order[0].orderStatus == 4 && item.order.length === 1">待收货</a> -->
                <a class="goods-oprate-state" v-if="item.order[0].orderStatus == 5 && item.order.length === 1">已完成</a>
                <!-- <a v-if="item.order[0].orderStatus == 1 && item.order.length === 1">待付款</a> -->
                <a v-if="item.payNow" class="red" @click="goPayPage(item)">立即支付</a>
                <a v-if="item.cancelOrder" @click="showCancelModal(item.id)">取消订单</a>
                <a v-if="item.takeGoods" class="red" @click="clickTake(item.id)">确认收货</a>
                <a @click="goDetail(item)">订单详情</a>
                <!-- <a @click="">确认收货</a> -->
                <a class="goods-oprate-state" v-if="(item.order[0].orderStatus == 3)  && item.order.length === 1 && item.order[0].goodsLists[0].rmaStatus == 10">待审核</a>
                <a class="goods-oprate-state" v-if="(item.order[0].orderStatus == 3)  && item.order.length === 1 && item.order[0].goodsLists[0].rmaStatus == 20 && item.order[0].goodsLists[0].rmaType == 2">待用户退货</a>
                <a class="goods-oprate-state" v-if="(item.order[0].orderStatus == 3)  && item.order.length === 1 && (item.order[0].goodsLists[0].rmaStatus > 25 && item.order[0].goodsLists[0].rmaStatus < 40 || (item.order[0].goodsLists[0].rmaStatus == 20 && item.order[0].goodsLists[0].rmaType == 1))">处理中</a>
                <a class="goods-oprate-state" v-if="(item.order[0].orderStatus == 3)  && item.order.length === 1 && item.order[0].goodsLists[0].rmaStatus == 40">已退款</a>
                <a v-if="item.order[0].orderStatus == 3 && item.order.length === 1 && item.order[0].isInRmaPeriod  && (item.order[0].goodsLists[0].rmaStatus == null || item.order[0].goodsLists[0].rmaStatus == 25 || item.order[0].goodsLists[0].rmaStatus == 50 || item.order[0].goodsLists[0].rmaStatus == 60)" @click="applyRefund(item.order[0])">申请退款</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-order" v-if="showNoResult">
      <div class="">
        <img src="~assets/img/no-order.png" alt="">
        <h1 v-if="typeList[0].active">抱歉！您暂时还没有任何订单！</h1>
        <h1 v-if="typeList[1].active">抱歉！没有待付款的订单！</h1>
        <h1 v-if="typeList[2].active">抱歉！没有待发货的订单！</h1>
        <h1 v-if="typeList[3].active">抱歉！没有待收货的订单！</h1>
        <span @click="$router.push('/')">去购物 >></span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Tag from '~components/biz/tag/tag'

export default {
  name: 'order-list',
  components: {
    [Tag.name]: Tag
  },
  data () {
    return {
      typeList: [{
        id: 0,
        active: false,
        name: '全部订单'
      }, {
        id: 1,
        active: false,
        name: '待付款'
      }, {
        id: 2,
        active: false,
        name: '待发货'
      },
      {
        id: 3,
        active: false,
        name: '待收货'
      }
      ],
      payNow: false,
      cancelOrder: false,
      showNoResult: false
    }
  },
  props: {
    orders: {}
  },
  watch: {
    orders: {
      deep: true,
      handler (val) {
        if (val.itemList.length) {
          this.showNoResult = false
          val.itemList.forEach((item) => {
            let takeGoodsState = true
            let isActivityState = false
            let cancelBySystem = false
            let totalQuantity = 0
            let isAllCancel = []
            let cancelFlag = true
            item.order.forEach((order) => {
              isAllCancel.push(order.orderStatus) // 用于判断是否可收获用
              let orderTotalQuantity = 0
              if (order.orderStatus === 1) {
                item.payNow = true
              }
              if (order.orderStatus > 2) {
                cancelFlag = false
              }
              order.goodsLists.forEach((good) => {
                totalQuantity = Number(good.quantity) + Number(totalQuantity)
                orderTotalQuantity = Number(good.quantity) + Number(orderTotalQuantity)
              })
              order.totalQuantity = orderTotalQuantity
              if (order.isPresale || order.isActivity) {
                isActivityState = true
              }
              if (order.orderStatus !== 4 && order.orderStatus < 6) { // 待收货或者为取消
                takeGoodsState = false
              }
              if (order.orderStatus === 8) {
                cancelBySystem = true
              }
            })
            item.cancelOrder = cancelFlag
            if (takeGoodsState && isAllCancel.indexOf(4) !== -1) { // 排除状态全部为已取消的情况
              item.takeGoods = true
            }
            item.isActivityState = isActivityState
            item.cancelBySystem = cancelBySystem
            let timeToPay = ''
            if (item.isActivityState) {
              timeToPay = moment(item.createTime).add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')
            } else {
              timeToPay = moment(item.createTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
            }
            item.totalQuantity = totalQuantity
            item.timeToPay = timeToPay
          })
        } else {
          this.showNoResult = true
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    setActive (index, id, source) {
      this.setActiveStyle(index)
      this.$emit('setActive', id)
    },
    setActiveStyle (index) {
      for (let i = 0; i < this.typeList.length; i += 1) {
        this.$set(this.typeList[i], 'active', false)
      }
      this.$set(this.typeList[index], 'active', true)
    },
    goGoodsDetail (item) {
      this.$router.push(`/goods/${item.goodsId}`)
    },
    applyRefund (order, good) {
      this.$router.push(`/refund/apply?orderId=${order.orderId}&goodsId=${good ? good.goodsId : null}&orderStatus=${order.orderStatus}`)
    },
    goPayPage (item) {
      this.$store.commit('order/setOrderSn', item.sn)
      this.$router.push({
        path: '/pay/wechat',
        query: {
          sn: item.sn
        }
      })
    },
    showCancelModal (id) {
      this.$emit('showCancelModal', id)
    },
    clickTake (id) {
      this.$emit('takeGoods', id)
    },
    goDetail (item) {
      window.open(`/order/${item.id}?source=account`)
      // this.$router.push(`/order/${item.id}?source=account`)
    }
  }
}
</script>

<style lang="less">
.order-list{
  width: 996px;
  margin: 0 auto;
  .pre-sale-tag{
    background: #ff8d00;
    margin-right: 10px;
    display: inline !important;
    color: white !important;
    margin-left: 0 !important;
    padding: 3px;
  }
  .gift-tag {
      background: #ff4544;
  }
  .pre-sale-bar{
    background: #ffecec;
    color: #ff4544;
    margin-top: 15px;
    height: 28px;
    font-size: 14px;
    line-height: 28px;
    .gz-icon{
      background: #ff4544;
      border-radius: 16px;
      color: #fff;
      padding: 3px;
      margin: 0 10px;
    }
    // .gz-icon {
    //   margin-right: 16px;
    //   margin-left: 12px;
    // }
  }
  .red{
    color: #ff4544 !important;
  }
  .no-order{
    display: flex;
    text-align: center;
    justify-content: center;
    margin-bottom: 228px;
    img{
      margin-top: 60px;
      width: 44px;
      height: 61px;
    }
    h1{
      margin-top: 20px;
      font-size: 14px;
      color: #666666;
    }
    span{
      margin-top: 17px;
      font-size: 16px;
      font-weight: 300;
      color: #ff4544;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .tab-bar{
    display: flex;
    .nav-list{
      width: 68px;
      margin-right: 20px;
    }
    span.nav{
      font-size: 14px;
      color: #333333;
      text-align: left;
      font-weight: 300;
      cursor: pointer;
      padding-bottom: 5px;
    }
    span.active{
      font-weight: 600;
      color: #ff4544;
      border-bottom: 3px solid #ff4544;
    }
  }
  .goods-list{
    margin-top: 10px;
    .goods-list-title{
      width: 996px;
      margin: 0 auto;
      background: #f4f4f4;
      height: 36px;
      display: flex;
      .title-span{
        text-align: center;
        display: inline-block;
        font-size: 14px;
        line-height: 36px;
      }
      .order-info{
        text-align: left;
        padding-left: 130px;
        box-sizing: border-box;
        width: 596px
      }
      .order-num{
        width: 100px;
      }
      .order-price{
        width: 100px;
      }
      .total-price{
        width: 149px;
      }
      .oprate{
        width: 166px;
      }
    }

    .goods-list-content{
      width: 996px;
      margin: 0 auto;
      margin-top: 10px;
      border: solid 1px #f4f4f4;
      box-sizing: border-box;
      span.title{
        background: #f4f4f4;
      }
      .content{
        display: flex;
        .content-left{
          padding-left: 20px;
          padding-top: 15px;
          width: 679px;
          box-sizing: border-box;
          border-right: 1px solid #f4f4f4;
          .order-item{
            box-sizing: border-box;
            width: 100%;
            height: auto;
            border-bottom: 1px dashed #f4f4f4;
            // padding-left: 20px;
            // padding-top: 15px;
            .goods-title-bar{
              display: flex;
              position: relative;
              align-items: center;
              .name{
                font-size: 16px;
                font-weight: 300;
                color: #333333;
              }
              .num{
                font-size: 14px;
                font-weight: 300;
                color: #999999;
                margin-right: 15px;
                margin-left: 18px;
              }
              .line3-list{
                font-size: 14px;
                font-weight: 300;
                color: #ff4544;
              }
              .apply-refund-order-1{
                position: absolute;
                right: 14px;
                cursor: pointer;
                color: #b7a078;
              }
            }

            .goods-content{
              width: 100%;
              display: flex;
              margin-bottom: 20px;
              .product-info{
                width: 596px;
                display: flex;
                align-items: center;
                img{
                  width: 100px;
                  height: 100px;
                }
                span{
                  margin-left: 19px;
                  font-size: 12px;
                  line-height: 1.5;
                  display: inline-block;
                  color: #333333;
                  width: 243px;
                }
              }
              .goods-price{
                font-size: 14px;
                font-weight: 600;
                color: #333333;
                display: flex;
                justify-content: center;
                width: 100px;
                align-items: center;
                font-family: Hiragino Sans GB, Microsoft Yahei;
                .refund-status{
                  display: block;
                  color: #b7a078;
                  line-height: 1.71;
                  font-size: 14px;
                  font-weight: 300;
                  cursor: pointer;
                }
                .alread-refund{
                  color: #999999;
                }
                .not-click{
                  text-decoration: none;
                  cursor: default;
                }
              }
              .goods-num{
                width: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                color: #999999;
              }
            }

          }
        }
        .content-right{
          width: 310px;
          box-sizing: border-box;
          display: flex;
          .goods-total-price{
            display: flex;
            align-items: center;
            text-align: center;
            width: 149px;
            border-right: 1px solid #f4f4f4;
            .price{
              width: 149px;
              display: block;
              font-size: 14px;
              font-weight: 600;
              color: #333333;
              font-family: Hiragino Sans GB, Microsoft Yahei;
            }
            .shipping-price{
              width: 149px;
              font-size: 12px;
              text-align: center;
              color: #999999;
              font-family: Hiragino Sans GB, Microsoft Yahei;
            }
          }
          .goods-oprate{
            display: flex;
            align-items: center;
            text-align: center;
            width: 166px;
            .goods-oprate-state:hover{
              color: #333333 !important;
              cursor: default !important;
            }
            a{
              display: block;
              width: 166px;
              font-size: 14px;
              cursor: pointer;
              color: #333333;
            }
            a:hover{
               color: #ff4544;
               text-decoration: none;
            }
          }
        }
      }

        .pay-alert{
          width: 100%;
          height: 30px;
          background-color: #fff1dc;
          .pay-word{
            margin-left: 20px;
            font-size: 12px;
            color: #b7a078;
            line-height: 30px;
            font-weight: 300;
            display: flex;
            align-items: center;
          }
          .red{
            color: #ff4544 !important;
          }
        }
        span.title{
          box-sizing: border-box;
          padding-left: 20px;
          backgr  font-size: 14px;
          font-weight: 600;
          line-height: 1.29;
          text-align: left;
          color: #333333;
          display: block;
          width: 100%;
          height: 36px;
          line-height: 36px;
          font-size: 12px;
          font-weight: 300;
          color: #999999;
        }
    }
  }
  .tag-item-order, .tag-item-order > span {
    width: auto !important;
    margin-left: 0 !important;
    color: #fff !important;
  }
}
</style>
