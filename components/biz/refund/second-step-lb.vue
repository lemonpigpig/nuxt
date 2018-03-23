<template lang="html">
  <div class="second-step-lb">
    <div class="edit-status" v-if="rmaDetail.status == 10">
      <span>您还可以： <span class="edit" @click="editRefund()">修改退款申请</span>        <span class="cancel" @click="cancelRefund()">取消退款申请</span></span>
    </div>

    <div class="edit-status reject-status" v-if="rmaDetail.status == 25">
      <span>您还可以： <span class="edit" @click="checkOrder()">重新提交退款申请</span></span>
    </div>

    <div class="edit-status" v-if="rmaDetail.status == 60">
      <span>您还可以： <span class="edit" @click="checkOrder()">返回我的订单</span>        <span class="cancel" @click="checkOrder()">继续申请退款</span></span>
    </div>

    <div class="agree-refund-status" v-if="rmaDetail.status == 26 || rmaDetail.status == 30">
      <p class="title">退货信息</p>
      <p class="title">{{rmaDetail.logisticsText}} {{rmaDetail.logisticsNumber}}</p>
      <!-- <p class="sub">{{rmaDetail.updateTime.replace('T', ' ')}}</p> -->
      <p class="title">{{rmaDetail && rmaDetail.returnInfo && rmaDetail.returnInfo.contact}} {{rmaDetail && rmaDetail.returnInfo && rmaDetail.returnInfo.phone}}</p>
      <p class="sub address">发货地址 {{rmaDetail && rmaDetail.returnInfo && rmaDetail.returnInfo.receiveArea}} {{rmaDetail && rmaDetail.returnInfo && rmaDetail.returnInfo.address}}</p>
      <div class="clock-bar">
        <gz-icon icon="clock" size="17"></gz-icon>
        等待收货验货处理...
      </div>
    </div>

    <div class="agree-refund-address" @click="showShippingList(false)" v-if="rmaDetail.status == 20 && rmaDetail.type == 2">
      <div class="alert-bar">
        <span class="title">填写退货信息</span>
        <gz-icon icon="info1" size="16"></gz-icon>
        <span class="sub">物流信息必填，否则将会影响您退货申请的处理</span>
      </div>
      <div class="address-form">
        <div class="control-modal">
          <div class="select-box"  @click="showShippingList(true, $event)">
            <span class="select-value">{{shipping.name == '' ? '快递公司' : shipping.name}}</span>
            <img src="~static/img/combined-shape.svg" alt="">
            <div class="select-options" v-if="showSlist">
              <ul>
              <li v-for="item in shippingList" @click="setShipping(item, $event)"><span>{{item.name}}</span></li>
              </ul>
            </div>
          </div>
          <input type="text" v-model="queryCondition.number"  placeholder="填写退货运单号" class="refund-number-class">
          <div class="clear-float"></div>
        </div>
        <div class="control-modal" style="margin-top: 38px;">
          <input type="text"  v-model="queryCondition.contact" placeholder="姓名，如张三 Eling" class="refund-number-class short-width">
          <input type="text" v-model="queryCondition.phone" placeholder="请填写正确的11位手机号码" class="refund-number-class">
        </div>
        <div class="control-modal" style="margin-top: 36px;">
          <addressSelected ref="areaCode" @sendSelectedAddress="getSelectInfo"></addressSelected>
          <!-- @sendSelectedAddress="getSelectInfo" -->
        </div>
        <div class="control-modal" style="margin-top: 20px;">
          <textarea placeholder="发货详细地址" v-model="queryCondition.address"></textarea>
        </div>

        <span class="btn-red" @click="submitRefundShipping()">提交</span>
      </div>
    </div>
  </div>
</template>

<script>
import addressSelected from '~components/biz/address/addressSelected'
export default {
  components: { addressSelected },
  props: {
    rmaDetail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      shippingList: [],
      shipping: {
        id: '',
        name: ''
      },
      showSlist: false,
      queryCondition: {
        type: '',
        number: '',
        contact: '',
        phone: '',
        areaId: '',
        address: ''
      }
    }
  },
  mounted () {
    if (this.rmaDetail.status === 20 && this.rmaDetail.type === 2) {
      this.$store.dispatch('rma/getShippingList').then((data) => {
        for (let i in data) {
          this.shippingList.push({
            id: i,
            name: data[i]
          })
        }
      })
    }
  },
  methods: {
    editRefund () {
      this.$emit('editRefund')
    },
    checkOrder () {
      this.$router.push('/account/center?type=1&source=order-search')
    },
    showShippingList (status, event) {
      if (status) {
        this.showSlist = !this.showSlist
      } else {
        this.showSlist = status
      }
      if (event) {
        event.stopPropagation()
      }
    },
    getSelectInfo (item) {
      if (item.selectedtype === 'regin') {
        this.$set(this.queryCondition, 'areaId', item.selectedCode)
      }
    },
    setShipping (shipping, event) {
      event.stopPropagation()
      this.showSlist = false
      this.shipping = shipping
    },
    cancelRefund () {
      this.$emit('showModal')
    },
    checkVal () {
      if (this.queryCondition.type === '') {
        this.$store.commit('common/setMessage', '请选择物流公司')
      } else if (this.queryCondition.number === '') {
        this.$store.commit('common/setMessage', '请填写物流单号')
      } else if (this.queryCondition.contact === '') {
        this.$store.commit('common/setMessage', '请填写姓名')
      } else if (this.queryCondition.phone === '') {
        this.$store.commit('common/setMessage', '请填写手机号')
      } else if (!(/^1[34578]\d{9}$/.test(this.queryCondition.phone))) {
        this.$store.commit('common/setMessage', '请填写正确的手机号')
      } else if (this.queryCondition.areaId === '') {
        this.$store.commit('common/setMessage', '请选择地区')
      } else if (this.queryCondition.address === '') {
        this.$store.commit('common/setMessage', '请填写详细地址')
      } else {
        return true
      }
    },
    submitRefundShipping () {
      this.queryCondition.id = this.$route.query.rmaId
      this.queryCondition.type = this.shipping.id
      if (this.checkVal()) {
        this.$store.dispatch('rma/submitRefundShipping', this.queryCondition).then((data) => {
          this.$emit('submitRefundShipping', data)
        }).catch((err) => {
          this.$store.commit('common/setMessage', err)
          this.$emit('submitRefundShipping', err)
        })
      }
    }
  }
}
</script>

<style lang="less">
.second-step-lb{
  margin-bottom: 40px;
  .edit-status{
    span{
      color: #333333;
      font-size: 14px;
    }
    .edit, .cancel{
      text-decoration: underline;
      cursor: pointer;
    }
    .cancel{
      margin-left: 20px;
    }
  }
  .agree-refund-status{
    p.title{
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      margin-top: 13px;
    }
    p.sub{
      font-size: 12px;
      color: #999999;
      line-height: 1.67;
    }
    p.address{
      font-size: 14px;
      line-height: 2.29;
      color: #9b9a9b;
    }
    .clock-bar{
      margin-top: 30px;
      color: #ff4544;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
    }
  }
  .agree-refund-address{
    margin-top: -34px;
    input,textarea::-webkit-input-placeholder{
        color: #999;
    }
    .alert-bar{
      width: 840px;
    	height: 32px;
    	background-color: #ffecec;
      line-height: 32px;
      .title{
        color: #333333;
        font-size: 14px;
	      font-weight: 600;
        margin-left: 10px;
        line-height: 32px;
      }
      .gz-icon{
        background-color: #ff4544;
        margin-left: 36px;
        border-radius: 50%;
        color: white;
        padding: 3px;
      }
      .sub{
        color: #ff4544;
        font-size: 14px;
        line-height: 32px;
        margin-left: 10px;
      }
    }
    .address-form{
      .control-modal{
        textarea{
          width: 397px;
        	height: 80px;
        	background-color: #ffffff;
        	border: solid 1px #cccccc;
          resize: none;
          font-size: 14px;
          padding: 10px;
        }
        .select-box{
          width: 201px;
          height: 32px;
          cursor: pointer;
          border: solid 1px #cccccc;
          background-color: #ffffff;
          display: inline-block;
          box-sizing: border-box;
          position: relative;
          margin-top: 22px;
          img{
            float: right;
            margin-top: 12px;
            margin-right: 10px;
          }
          .select-options{
            position: absolute;
            width: 201px;
            // height: 100px;
            border: 1px solid #cccccc;
            border-top: 0;
            // display: none;
            margin-top: -1px;
            margin-left: -1px;
            background: white;
            ul{
              padding-bottom: 20px;
              li{
                span{
                  display: inline-block;
                  margin-left: 20px;
                  color: #333333;
                  font-size: 12px;
                  line-height: 1.67;
                }
                .gz-icon{
                  margin-left: 10px;
                }
              }
              li:hover{
                background: #549bff;
                span{
                  color: white;
                }
              }
            }
          }
          .select-value{
            font-size: 14px;
            color: #999999;
            line-height: 32px;
            padding-left: 9px;
          }
        }
        .refund-number-class{
          width: 300px;
        	height: 32px;
        	background-color: #ffffff;
        	border: solid 1px #cccccc;
          margin-left: 28px;
          padding-left: 9px;
          font-size: 14px;
          display: inline-block;
          margin-top: -1px;
        }
        .short-width{
          width: 201px;
          margin-left: 0;
        }
      }
      .btn-red{
        width: 160px;
      	height: 50px;
      	background-color: #ff4544;
        display: inline-block;
        color: #ffffff;
        line-height: 50px;
        cursor: pointer;
        text-align: center;
        font-size: 16px;
	      font-weight: 600;
        margin-top: 30px;
        margin-bottom: 36px;
      }
    }

  }
}
</style>
