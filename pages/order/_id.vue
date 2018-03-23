<template lang="html">
  <div class="account-order-detail">
    <alert-modal ref="productAlertModal" @comfirm="comfirm">
      <div slot="modal-content">确定取消订单吗？</div>
    </alert-modal>
    <alert-modal ref="takeGoods" @comfirm="updateOrder">
      <div slot="modal-content">是否要确认收货？</div>
    </alert-modal>
    <side-bar v-show="iShowMenu" :flag="0"></side-bar>
    <div class="detail-content">
      <div class="pay-alert" v-if="orderDetail.payNow">
        <span class="pay-word"><img src="~assets/img/Group 125.png" style="width: 16px;margin-right:14px;"/> 您的订单提交成功，请在 <span class="red">{{orderDetail.timeToPay}}</span> 前完成支付，超时订单将自动取消！</span>
      </div>
      <div class="pay-alert" v-if="orderDetail.cancelBySystem">
        <span class="pay-word"><img src="~assets/img/Group 125.png" style="width: 16px;margin-right:14px;"/>订单超时已自动取消</span>
      </div>
      <div class="oprate-content">
        <div class="detail-info">
          <div class="order-header">
            <span class="col col-1"> <span class="info-title">订单号</span>：<span class="info">{{orderDetail.sn}}</span></span>
            <span class="col col-2"><span class="info-title">下单时间</span>：<span class="info">{{orderDetail.createTime && orderDetail.createTime.replace('T', ' ')}}</span></span>
          </div>
          <div class="order-content">
            <span class="col col-1"><span class="info-title"> 收货人</span>：<span class="info"><span class="order-delivery-name">{{orderDetail.addressInfo && orderDetail.addressInfo.name}}</span>（{{orderDetail.addressInfo &&  orderDetail.addressInfo.telephone}}）</span></span>
            <span class="col col-2"><span class="info-title"><span v-if="isOneselfTake">自提</span><span v-else>收货</span>地址</span>：<span class="info">{{orderDetail && orderDetail.addressInfo && orderDetail.addressInfo.province}}{{orderDetail && orderDetail.addressInfo && orderDetail.addressInfo.city}}{{orderDetail && orderDetail.addressInfo && orderDetail.addressInfo.district}}{{orderDetail && orderDetail.addressInfo && orderDetail.addressInfo.detail}}</span></span>
            <span class="col col-1"><span class="info-title">商品合计</span>：<span class="info" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{Number(orderDetail.goodsTotalAmount).toFixed(2)}} </span></span>
            <span class="col col-2"><span class="info-title">优惠券</span>：<span class="info" style="font-family: Hiragino Sans GB, Microsoft Yahei;">-¥{{Number(orderDetail.couponDiscountAmount).toFixed(2)}}</span></span>
            <span class="col col-2"><span class="info-title">折扣</span>：<span class="info" style="font-family: Hiragino Sans GB, Microsoft Yahei;">-¥{{Number(orderDetail.discountAmount).toFixed(2)}}</span></span>
            <span class="col col-2"><span class="info-title">运费</span>：<span class="info" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{Number(orderDetail.shippingFee).toFixed(2)}}</span></span>
            <span class="col col-2"><span class="info-title">应付总额</span>：<span class="price" style="font-family: Hiragino Sans GB, Microsoft Yahei;">￥{{Number(orderDetail.orderPayment).toFixed(2)}}</span></span>
          </div>
          <div class="receipt-content">
            <span class="col col-1"><span class="info-title">发票类型</span>：<span class="info">{{orderDetail.invoiceType ? '普通发票' : '不开发票'}}</span></span>
            <span class="col col-1" style="width: 600px !important" v-if="orderDetail.invoiceType"><span class="info-title" >发票抬头</span>：<span class="info info-receipt-title">{{orderDetail.invoiceTitle}} </span></span>
            <span class="col col-1" v-if="orderDetail.invoiceType"><span class="info-title" >发票内容</span>：<span class="info">{{orderDetail.invoiceContent == 2 ? '明细' : '食品'}} </span></span>
          </div>
        </div>

        <div class="oprate-button">
          <button type="button" name="button" class="btn btn-grey" v-if="orderDetail.cancelOrder" @click="cancelOrder">取消订单</button>
          <button type="button" name="button" class="btn btn-red" v-if="orderDetail.payNow" @click="goPayPage">立即支付</button>
          <button type="button" name="button" class="btn btn-red" v-if="orderDetail.takeGoods" @click="clickTake">确认收货</button>
        </div>
      </div>

      <div class="muti-order" v-if="orderDetail.order && orderDetail.order.length>1">
        <div class="tab" v-for="(item,index) in orderDetail.order" :class="{'tab-active':item.active}" @click="setOrderSelect(index, item.orderStatus)">
          <span class="line1">包裹{{index+1}}</span>
          <span class="line2">{{item.totalGoodsQuantity}}件</span>

          <!-- <span class="line3" v-if="item.orderStatus == 1">待付款</span>
          <span class="line3" v-if="item.orderStatus == 2 || item.orderStatus == 3  ">待发货</span>
          <span class="line3" v-if="item.orderStatus == 4 ">待收货</span>
          <span class="line3" v-if="item.orderStatus == 5 ">已完成</span>
          <span class="line3" v-if="item.orderStatus == 6 || item.orderStatus == 7 || item.orderStatus == 8">已取消</span> -->
          <!-- <span class="line3">{{item.orderStatus}}</span> -->
        </div>
      </div>
      <div class="goods-detail" :class="{'goods-detail-active': orderDetail.order && orderDetail.order.length>1}">
        <table class="table-head" >
          <thead>
            <tr>
              <th class="first" width="495"><span>商品信息</span></th>
              <th width="167"><span>数量</span></th>
              <th width="167"><span>单价</span></th>
              <!-- <th width="167" v-if="orderDetail.order && orderDetail.order.length>1"><span >操作</span></th> -->
              <!-- v-if="orderDetail.order && orderDetail.order.length<=1" -->
              <th width="167" ><span >状态</span></th>
            </tr>
          </thead>
        </table>
        <table class="table-body">
          <tbody v-if="orderDetail && orderDetail.order">
            <tr  v-for="(item, index) in orderDetail.order[tabIndex].goodsLists">
              <td width="495" class="goods-title" @click="goGoodsDetail(item)" style="cursor: pointer">
                <div class="goods-img">
                  <img :src="item.goodsImage" alt="">
                </div>
                <span>
                    <gz-tag backgroundColor="#ff8d00" v-if="orderDetail.order[tabIndex].isPresale">
                      <span slot="tag-text">预售</span>
                    </gz-tag>
                    <gz-tag backgroundColor="#ff4544" v-if="item.itemType === 2">
                      <span slot="tag-text">赠品</span>
                    </gz-tag>
                    <gz-tag backgroundColor="#555c78" v-if="orderDetail.order[0].isAbholung">
                      <span slot="tag-text">自提</span>
                    </gz-tag>
                    {{item.goodsName}}
                    <div class="pre-sale-bar" v-if="orderDetail.order[tabIndex].isPresale">
                      <gz-icon icon="info1" size="16"/></gz-icon>
                      预计 {{orderDetail.order[tabIndex].presaleTime}}发货
                    </div>
              </span>
              </td>
              <td class="goods-num" width="167"><span>x{{item.quantity}}</span></td>

              <!-- <td width="167" class="goods-price"><span>¥{{Number(item.salePrice).toFixed(2)}}</span></td> -->
              <td width="167" class="goods-price">
               <span>¥{{Number(item.salePrice).toFixed(2)}}</span>
               <a class="refund-status" v-if="(item.rmaStatus == null || item.rmaStatus == 25 || item.rmaStatus == 60 || item.rmaStatus == 50) && orderDetail.order[tabIndex].isInRmaPeriod && item.itemType !== 2 && (orderDetail.order[tabIndex].orderStatus == 4 || orderDetail.order[tabIndex].orderStatus == 5)" @click="applyRefund(orderDetail.order[tabIndex], item)">申请退款</a>
               <span class="refund-status" v-if="item.rmaStatus == 10 && (orderDetail.order[tabIndex].orderStatus == 4 || orderDetail.order[tabIndex].orderStatus == 5) && item.itemType !== 2">待审核</span>
               <span class="refund-status" v-if="(item.rmaStatus == 20 && item.rmaType == 2) && (orderDetail.order[tabIndex].orderStatus == 4 || orderDetail.order[tabIndex].orderStatus == 5) && item.itemType !== 2">待用户退货</span>
               <span class="refund-status" v-if="item.rmaStatus > 25 && item.rmaStatus < 40 || (item.rmaStatus == 20 && item.rmaType == 1) && (orderDetail.order[tabIndex].orderStatus == 4 || orderDetail.order[tabIndex].orderStatus == 5) && item.itemType !== 2">处理中</span>
               <span class="refund-status grey" v-if="item.rmaStatus == 40 && (orderDetail.order[tabIndex].orderStatus == 4 || orderDetail.order[tabIndex].orderStatus == 5) && item.itemType !== 2">已退款</span>
             </td>

              <!-- <td width="167" :rowspan="orderDetail.order[tabIndex].goodsLists.length" v-if="orderDetail.order && orderDetail.order.length>1 && index == 0" class="price-state">
                <span v-if="orderDetail.order[tabIndex].orderStatus == 1" style="cursor:pointer" @click="cancelChild(item)">取消包裹</span>
              </td> -->
              <!--orderDetail.order && orderDetail.order.length<=1 &&   -->
              <td width="167" :rowspan="orderDetail.order[tabIndex].goodsLists.length" v-if="index == 0" class="price-state">
                <span v-if="orderDetail.order[tabIndex].orderStatus == 1">待付款</span>

                <span class="refund-status-state orange" v-if="orderDetail.order[tabIndex].orderStatus == 3 && orderDetail.order[tabIndex].isInRmaPeriod && (orderDetail.order[tabIndex].goodsLists[0].rmaStatus == null || orderDetail.order[tabIndex].goodsLists[0].rmaStatus == 25 || orderDetail.order[tabIndex].goodsLists[0].rmaStatus == 50 || orderDetail.order[tabIndex].goodsLists[0].rmaStatus == 60)" @click="applyRefund(orderDetail.order[tabIndex])">申请退款</span>
                <span class="refund-status-state" v-if="orderDetail.order[tabIndex].goodsLists[0].rmaStatus == 10 && orderDetail.order[tabIndex].orderStatus == 3">待审核</span>
                <span class="refund-status-state" v-if="orderDetail.order[tabIndex].goodsLists[0].rmaStatus == 20 && orderDetail.order[tabIndex].goodsLists[0].rmaType == 2 && orderDetail.order[tabIndex].orderStatus == 3">待用户退货</span>
                <span class="refund-status-state" v-if="orderDetail.order[tabIndex].goodsLists[0].rmaStatus > 25 && orderDetail.order[tabIndex].goodsLists[0].rmaStatus < 40 || (orderDetail.order[tabIndex].goodsLists[0].rmaStatus == 20 && orderDetail.order[tabIndex].goodsLists[0].rmaType == 1) && orderDetail.order[tabIndex].orderStatus == 3">处理中</span>
                <span class="refund-status-state grey" v-if="orderDetail.order[tabIndex].goodsLists[0].rmaStatus == 40 && orderDetail.order[tabIndex].orderStatus == 3">已退款</span>

                <span v-if="orderDetail.order[tabIndex].orderStatus == 2 || orderDetail.order[tabIndex].orderStatus == 3  ">
                  <span v-if="orderDetail.order[0].isAbholung">待自提</span>
                  <span v-else>待发货</span>
                </span>
                <span v-if="orderDetail.order[tabIndex].orderStatus == 4 ">
                  <span v-if="orderDetail.order[0].isAbholung">待自提</span>
                  <span v-else>待收货</span>
                </span>
                <span v-if="orderDetail.order[tabIndex].orderStatus == 5 ">已完成</span>
                <span v-if="orderDetail.order[tabIndex].orderStatus == 6 || orderDetail.order[tabIndex].orderStatus == 7 || orderDetail.order[tabIndex].orderStatus == 8">已取消</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="progress-content" v-if="showProgressBar">
          <stepInfo :stepinfo="progressinfo" :showComplete="showComplete" :completeActive="completeActive"></stepInfo>
      </div>

      <div class="order-track-detail">
        <div class="track-header">
          订单跟踪详情
        </div>
        <div class="track-detail">
          <ul class="header">
          <span class="col col1">
            处理时间
          </span>
          <span class="col col2">
            操作
          </span>
          <li v-for="history in historyList">
            <span class="col col1 li-col">
              {{history.createTime.replace('T', ' ')}}
            </span>
            <span class="col col2 li-col" v-if="history.status == 1">
              您的订单已提交
            </span>
            <span class="col col2 li-col" v-if="history.status == 2">
              您的订单已支付，等待系统确认
            </span>
            <span class="col col2 li-col" v-if="history.status == 3">
              您的订单审核通过
            </span>

            <span class="col col2 li-col" v-if="history.status == 9">
              您的订单已进入仓库系统，开始仓库作业
            </span>
            <span class="col col2 li-col" v-if="history.status == 4">
              您的订单已出库，承运商为{{orderDetail.order[tabIndex].logisticsCompany}}，单号{{orderDetail.order[tabIndex].logisticsSn}}
            </span>
            <span class="col col2 li-col" v-if="history.status == 5">
              您的订单已完成
            </span>
            <span class="col col2 li-col" v-if="history.status == 6 || history.status == 7">
              您的订单已取消
            </span>
            <span class="col col2 li-col" v-if="history.status == 8">
              您的订单因支付超时取消
            </span>
          </li>
          </ul>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import stepInfo from '~components/stepinfo.vue'
import AlertModal from '~components/alert-modal'
import SideBar from '~components/biz/sidebar'
import Tag from '~components/biz/tag/tag'
export default {
  components: {
    [SideBar.name]: SideBar,
    [AlertModal.name]: AlertModal,
    [Tag.name]: Tag,
    stepInfo
  },
  data () {
    return {
      iShowMenu: !!this.$route.query.source,
      showComplete: true,
      completeActive: false,
      showProgressBar: true,
      progressinfo: [{ name: '提交订单', class: '' }, { name: '付款成功', class: '' }, { name: '待发货', class: '' }, { name: '已发货', class: '' }],
      active: '订单查询',
      tabList: [{
        name: '包裹1',
        num: ' 1件',
        state: '已取消',
        active: true
      }, {
        name: '包裹2',
        num: ' 1件',
        state: '已取消',
        active: false
      }
      ],
      historyList: [],
      tabIndex: 0,
      orderDetail: {},
      isOneselfTake: false
    }
  },
  watch: {
    orderDetail: {
      handler () {
        this.$set(this, 'isOneselfTake', this.orderDetail.order[0].isAbholung)
        if (this.orderDetail.order[0].isAbholung) {
          this.progressinfo[2].name = '待自提'
          this.progressinfo[3].name = '已自提'
        }
      },
      deep: true
    }
  },
  methods: {
    cancelChild (item) {
      this.$store.dispatch('order/cancelChildOrder', item.orderId).then((data) => {
        if (data) {
          this.$refs.productAlertModal.close()
          this.fetchData()
        }
      })
    },
    setOrderSelect (index, state) {
      this.setProgressActive(state)
      this.tabIndex = index
      this.historyList = this.orderDetail.order[index].historyList
      for (let i = 0; i < this.orderDetail.order.length; i += 1) {
        this.$set(this.orderDetail.order[i], 'active', false)
      }
      this.$set(this.orderDetail.order[index], 'active', true)
    },
    cancelOrder () {
      this.$refs.productAlertModal.showModal()
    },
    applyRefund (order, good) {
      this.$router.push(`/refund/apply?orderId=${order.orderId}&goodsId=${good ? good.goodsId : null}&orderStatus=${order.orderStatus}`)
    },
    goPayPage () {
      this.$router.push({
        path: '/pay/wechat',
        query: {
          sn: this.orderDetail.sn
        }
      })
    },
    clickTake () {
      this.$refs.takeGoods.showModal()
    },
    updateOrder () {
      this.$store.dispatch('order/confirmReceipt', this.$route.params.id).then((data) => {
        if (data) {
          this.$refs.takeGoods.close()
          this.fetchData()
        }
      })
    },
    goGoodsDetail (item) {
      this.$router.push(`/goods/${item.goodsId}`)
    },
    setProgressActive (status) {
      this.progressinfo.forEach((item) => {
        item.class = ''
      })
      if (status === 1) {
        this.showProgressBar = true
        this.progressinfo[0].class = 'active'
      } else if (status === 2 || status === 3) {
        this.showProgressBar = true
        this.progressinfo[1].class = 'active'
        this.progressinfo[2].class = 'active'
        this.progressinfo[0].class = 'active'
      } else if (status === 4) {
        this.showProgressBar = true
        this.progressinfo[1].class = 'active'
        this.progressinfo[0].class = 'active'
        this.progressinfo[2].class = 'active'
        this.progressinfo[3].class = 'active'
      } else if (status === 5) {
        this.showProgressBar = true
        this.completeActive = true
        this.progressinfo.forEach((item) => {
          item.class = 'active'
        })
      } else if (status > 5) {
        this.showProgressBar = false
      }
    },
    fetchData () {
      this.$store.dispatch('order/getOrderDetail', this.$route.params.id).then((data) => {
        data.order[0].active = true
        this.setProgressActive(data.order[0].orderStatus)
        let takeGoodsState = true
        let showProgress = true
        let cancelBySystem = false
        let isAllCancel = []
        let cancelFlag = true
        this.historyList = data.order[0].historyList
        data.order.forEach((order) => {
          let num = 0
          isAllCancel.push(order.orderStatus)
          if (order.isPresale) {
            order.presaleTime = moment(order.presaleTime).format('MM月DD日')
          }
          if (order.pushStatus === 1 && order.pushTime !== '1970-01-01T00:00:00') {
            const historyTemp = {
              createTime: order.pushTime,
              status: 9
            }
            order.historyList.splice(3, 0, historyTemp)
          }
          order.goodsLists.forEach((good) => {
            num += good.quantity
          })
          order.totalGoodsQuantity = num
          if (order.orderStatus === 5) {
            this.completeActive = true
          }
          if (order.orderStatus === 1) {
            data.payNow = true
          }
          if (order.orderStatus > 2) {
            cancelFlag = false
          }
          if (order.orderStatus === 8) {
            cancelBySystem = true
          }
          if (order.orderStatus !== 4 && order.orderStatus < 6) {
            takeGoodsState = false
          }
          if (order.orderStatus < 6) {
            showProgress = false
          }
        })
        data.cancelBySystem = cancelBySystem
        this.showProgressBar = !showProgress
        data.cancelOrder = cancelFlag
        if (takeGoodsState && isAllCancel.indexOf(4) !== -1) {
          data.takeGoods = true
        }
        let timeToPay = ''
        if (data.isActivity || data.isPresale) {
          timeToPay = moment(data.createTime).add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        } else {
          timeToPay = moment(data.createTime).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }

        data.timeToPay = timeToPay
        console.log(352, data)
        this.$set(this, 'orderDetail', Object.assign({}, data))
      })
    },
    comfirm () {
      this.$store.dispatch('order/cancelOrder', this.$route.params.id).then((data) => {
        if (data) {
          this.$refs.productAlertModal.close()
          this.fetchData()
        }
      })
    }
  },
  mounted () {
    this.$store.commit('common/setBreadCrumbVisibility', true)
    this.$store.commit('common/setBreadCrumbList', [{
      name: '账户中心',
      url: '/account/center'
    }, {
      name: '订单查询',
      url: '/account/center?type=1&source=order-search'
    }, {
      name: '订单详情'
    }])
    this.fetchData()
  }

}
</script>

<style lang="less">
.account-order-detail{
  width: 1200px;
  margin: 0 auto;
  display: flex;
  margin-bottom: 136px;
  font-family: Hiragino Sans GB, Microsoft Yahei;
  .pre-sale-bar{
    background: rgba(255, 69, 68, 0.1);
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
  }
  .red{
    color: #ff4544;
  }
  .detail-content{
    width: 996px;
    margin-left: 20px;
    .pay-alert{
      width: 100%;
      height: 30px;
      margin-bottom: 10px;
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
    }
    .muti-order{
      width: 996px;
      background: #f4f4f4;
      height: 36px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      .tab{
        width: 250px;
        height: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 300;
        box-sizing: border-box;
        color: #333333;
        .line1{
          font-size: 16px;
          font-weight: 300;
          color: #333333;
        }
        .line2{
          margin-left: 18px;
          margin-right: 15px;
          font-size: 14px;
          font-weight: 300;
          color: #999999;
        }
        .line3{
          font-size: 14px;
          font-weight: 300;
          color: #ff4544;
        }
      }
      .tab-active{
        background: white;
        border-top: 1px solid #bab5b0;
        border-right: 1px solid #bab5b0;
        border-bottom: 1px solid white;
        border-left: 1px solid #bab5b0;
        margin-bottom: -1px;
      }
    }
    .goods-detail-active{
      border: 1px solid #bab5b0 !important;
      margin-top: 0 !important;
      padding-top: 20px;
    }
    .goods-detail{
      width: 996px;
      margin: 0 auto;
      border: solid 1px #f4f4f4;
      box-sizing: border-box;
      margin-top: 40px;

      table.table-head{
        width: 100%;
       background: #f4f4f4;
        thead{
          width: 100%;
          background: #f4f4f4;
          th{
            height: 36px;
            font-size: 12px;
            text-align: center;
            font-weight: 300;
            color: #333333;
          }
          th.first{
            text-align: left;
            span{
                margin-left: 20px;
            }
          }
        }
      }
      table.table-body{
        .goods-title{
          display: flex;
          align-items: center;
          text-align: left;
          .goods-img{
            width: 114px;
            height: 114px;
            margin-left: 13px;
          }
          span{
            width: 230px;
            text-align: justify;
            font-size: 12px;
            line-height: 1.5;
            color: #333333;
            font-weight: 300;
            margin-left: 12px;
          }
          .tag-item, .tag-item span {
            width: auto;
            font-weight: normal;
            margin-left: 0;
            color: #fff;
          }
        }
        .goods-price{
          span{
            font-size: 14px;
            font-weight: 600;
            line-height: 1.29;
            color: #333333;
          }
          .refund-status{
            display: block;
            color: #b7a078;
            line-height: 1.71;
            font-size: 14px;
            font-weight: 300;
            cursor: pointer;
            text-decoration: none;
          }
          .grey{
            color: #cccccc;
          }
          .red{
            color: #ff4544;
          }
        }
        .price-state{
          font-size: 12px;
          line-height: 1.5;
          color: #ff4544;
          font-weight: 300;
          cursor: default;
          border-left: 1px solid #f4f4f4;
          .refund-status-state{
            display: block;
            color: #333333;
            line-height: 1.71;
            font-weight: 300;
            text-decoration: none;
          }
          .orange {
            cursor: pointer;
            color: #b7a078;
          }
        }
        .goods-price-detail{
          span{
            display: block;
          }
          .price-total{
            font-size: 14px;
            font-weight: 600;
            line-height: 1.29;
            color: #333333;
          }
          .price-mail{
            font-size: 12px;
            line-height: 2;
            color: #999999;
            font-weight: 300;
          }
          .price-pay-way{
            font-size: 14px;
            font-weight: 600;
            line-height: 1.71;
            color: #333333;
          }
        }
        .goods-num{
          span{
            font-size: 12px;
            line-height: 1.5;
            color: #999999;
          }
        }
        td{
          height: 135px;
          text-align: center;
        }
      }
    }

    .oprate-content{
      width: 100%;
      background: #f4f4f4;
      height: auto;
      display: flex;


      .detail-info{
        width: 676px;
        height: 100%;
        padding-left: 20px;
        .order-header{
          height: 50px;
          width: 100%;
          border-bottom: 1px solid #dddddd;
          line-height: 50px;
        }
        .order-content{
          margin-top: 20px;
          padding-bottom: 25px;
          border-bottom: 1px solid #dddddd;
        }
        .receipt-content{
          padding-top: 16px;
          padding-bottom: 20px;
          .col {
            display: block !important;
          }
        }
        span.col{
          .info-title{
            width: 75px;
            display: inline-block;
            text-align: justify;
            text-align-last: justify;
          }
          display: inline-block;
          font-size: 14px;
          line-height: 1.86;
          color: #999999;
          font-weight: 300;
          .info-receipt-title{
            max-width: 500px !important;
          }
          .info{
            color: #333333;
            max-width: 225px;
            // overflow: hidden;
            // max-height: 26px;
            display: inline-flex;
            .order-delivery-name{
              max-width: 70px;
              overflow: hidden;
              max-height: 26px;

            }

          }
          .price{
            font-size: 22px;
            font-weight: 600;
            color: #ff4544;
          }
        }
        .col-1{
          width: 328px;
        }
        .col-2{
          width: 328px;
        }
      }
      .oprate-button{
        width: 320px;
        height: 100%;
        .btn{
          width: 140px;
          height: 36px;
          color: white;
          outline: none;
          border: none;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.5;
          color: #ffffff;
        }
        .btn-grey{
            margin-top: 33px;
            float: right;
            margin-right: 77px;
            background-color: #908888;
        }
        .btn-red{
          background-color: #ff4544;
          float: right;
          margin-right: 77px;
          margin-top: 24px;
        }
      }
    }
    .progress-content{
      width: 996px;
      margin: 0 auto;
      margin-top: 75px;
      display: flex;
      justify-content: center;
    }
    .order-track-detail{
      width: 996px;
      margin: 0 auto;
      margin-top: 67px;
      .track-detail{
        width: 100%;
         border: solid 1px #f4f4f4;
         padding: 20px;
         box-sizing: border-box;
         .header{
           list-style: none;
           .col{
             font-size: 14px;
              font-weight: 600;
              color: #333333;
              display: inline-block;;
           }
           .col1{
             width: 310px;
           }
           .li-col{
             font-weight: 300;
            line-height: 2.14;
           }
         }
      }
      .track-header{
         box-sizing: border-box;
        width: 100%;
        padding-left: 20px;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        color: #333333;
        background: #f4f4f4;
      }
    }
  }
}

</style>
