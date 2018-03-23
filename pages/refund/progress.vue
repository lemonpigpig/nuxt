<template lang="html">
  <div class="apply-refund-progress">
    <div class="refund-progress-bar" v-if="type == 1">
      <div class="refund-progress-bar-arrow step1" :class="{'step1-active': $route.query.orderId}">
        <span>申请退款</span>
      </div>
      <div class="refund-progress-bar-arrow step2" :class="{'step2-active': rmaDetail.status == 10 || rmaDetail.status == 25 || rmaDetail.status == 20 || rmaDetail.status == 60 || rmaDetail.status == 35}">
        <span>处理退款申请</span>
      </div>
      <div class="refund-progress-bar-arrow step3" :class="{'step3-active': rmaDetail.status == 40}">
        <span>退款完成</span>
      </div>
    </div>
    <div class="refund-progress-bar" v-if="type == 2">
      <div class="refund-progress-bar-arrow short-arrow step-short1" :class="{'step-short1-active': $route.query.orderId}">
        <span>申请退货退款</span>
      </div>
      <div class="refund-progress-bar-arrow short-arrow step-short2" :class="{'step-short2-active': rmaDetail.status == 10 || rmaDetail.status == 25  || rmaDetail.status == 60}">
        <span>处理退款退货申请</span>
      </div>
      <div class="refund-progress-bar-arrow short-arrow step-short2" :class="{'step-short2-active': rmaDetail.status == 20 && rmaDetail.type == 2 || rmaDetail.status == 26 || rmaDetail.status == 30 || rmaDetail.status == 35}">
        <span>退货</span>
      </div>
      <div class="refund-progress-bar-arrow short-arrow step-short3" style="width: 315px;" :class="{'step-short3-active': rmaDetail.status == 40}">
        <span>确认收货，退款完成</span>
      </div>
    </div>

    <keep-alive>
        <component :is="currentView" @cancelSave="cancelSave" @showModal="showModalContent"
         :refundDetail="preRmaDetail" :rmaDetail="rmaDetail" @subimtRefund="subimtRefund" @editRefund="editRefund"
         @submitRefundShipping="submitRefundShipping"
         ></component>
    </keep-alive>
    <div class="alert-cancel-refund-modal" v-if="showModal">
      <div class="modal-content-refund">
        <div class="modal-title">
          <span>取消申请</span>
          <span class="gz-icon-span" @click="notNow()"><gz-icon icon="close" size="16" @click="notNow()"></gz-icon></span>
          <div class="clear-float"></div>
        </div>
        <div class="modal-content">
          <p>取消申请后，本次申请将关闭，您还可以再次发起。</p>
          <p>确定要继续吗？</p>
        </div>
        <div class="modal-footer">
          <span class="btn btn-red" @click="cancelRefund()">确定</span>
          <span class="btn btn-grey" @click="notNow()">我再想想</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FirstStep from '~components/biz/refund/first-step.vue'
import SecondStep from '~components/biz/refund/second-step.vue'
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
    if (!this.$route.query.rmaId) {
      this.currentView = 'first-step'
      this.type = this.$route.query.type
      const param = {
        orderId: this.$route.query.orderId,
        goodsId: this.$route.query.goodsId === 'null' ? null : this.$route.query.goodsId
      }
      this.$store.dispatch('rma/getPreRmaDetail', param).then((data) => {
        if (this.$route.query.withGoods === '0') {
          data.data.items.forEach((good) => {
            if (good.itemType === 2) {
              good.quantity = 0
            }
          })
        }
        this.$set(this, 'preRmaDetail', Object.assign({}, data.data))
      })
    } else {
      this.fetchData()
    }
  },
  components: {
    FirstStep,
    SecondStep
  },
  data () {
    return {
      currentView: 'first-step',
      preRmaDetail: {},
      rmaDetail: {},
      type: 1,
      showModal: false
    }
  },
  methods: {
    routeChange () {
      this.$store.commit('common/setShowNavigation', false)
      this.fetchData()
    },
    subimtRefund (data) {
      console.log(data)
      if (!isNaN(data) && !this.$route.query.rmaId) {
        this.$router.replace(`/refund/progress?rmaId=${data}`)
      } else if (this.$route.query.rmaId && !isNaN(data)) {
        this.currentView = 'second-step'
      }
    },
    submitRefundShipping (data) {
      if (!isNaN(data)) {
        this.fetchData()
      }
    },
    fetchData () {
      this.$store.dispatch('rma/getRmaDetail', this.$route.query.rmaId).then((data) => {
        this.currentView = 'second-step'
        this.type = data.type
        console.log(data)
        this.$set(this, 'rmaDetail', Object.assign({}, data))
        this.$set(this, 'preRmaDetail', this.rmaDetail)
      })
    },
    cancelRefund () {
      this.$store.dispatch('rma/cancelRmaApply', this.$route.query.rmaId).then((data) => {
        if (data) {
          this.$store.commit('common/setMessage', '操作成功')
          this.$set(this, 'showModal', false)
          this.$router.push('/account/center?source=rma-list')
        }
      })
    },
    notNow () {
      this.$set(this, 'showModal', false)
    },
    showModalContent () {
      this.$set(this, 'showModal', true)
    },
    cancelSave () {
      if (this.$route.query.rmaId) {
        this.currentView = 'second-step'
      } else {
        this.$router.push('/account/center?type=1&source=order-search')
      }
    },
    editRefund () {
      this.$set(this, 'preRmaDetail', this.rmaDetail)
      this.currentView = 'first-step'
    }
  },
  watch: {
    '$route': 'routeChange'
  }
}
</script>

<style lang="less">
.apply-refund-progress{
  width: 100%;
  margin: -27px auto 0;
  .clear-float{
    clear:both;
  }
  .refund-progress-bar{
    width: 1200px;
    margin: 0 auto;
    &-arrow{
      display: inline-block;
      height: 38px;
      text-align: center;
      width: 420px;
      span{
        color: white;
        text-align: center;
        line-height: 38px;
        font-size: 14px;
        font-weight: 600;
      }
    }
    .short-arrow{
      width: 320px;
    }
    .step1{
      background: url('~static/img/long-1-grey.svg') no-repeat;
    }
    .step2{
      margin-left: -25px;
      background: url('~static/img/long-2-grey.svg') no-repeat;
    }
    .step3{
      margin-left: -35px;
      background: url('~static/img/long-3-grey.svg') no-repeat;
      background-position: right;
    }
    .step1-active{
      background: url('~static/img/long-1-red.svg') no-repeat;
    }
    .step2-active{
      margin-left: -25px;
      background: url('~static/img/long-2-red.svg') no-repeat;
    }
    .step3-active{
      margin-left: -35px;
      background: url('~static/img/long-3-red.svg') no-repeat;
      background-position: right;
    }
    .step-short1{
      background: url('~static/img/short-1-grey.svg') no-repeat;
    }
    .step-short2{
      margin-left: -25px;
      background: url('~static/img/short-2-grey.svg') no-repeat;
    }
    .step-short3{
      margin-left: -25px;
      background-position: right;
      background: url('~static/img/short-3-grey.svg') no-repeat;
    }
    .step-short1-active{
      background: url('~static/img/short-1-red.svg') no-repeat;
    }
    .step-short2-active{
      margin-left: -25px;
      background: url('~static/img/short-2-red.svg') no-repeat;
    }
    .step-short3-active{
      margin-left: -25px;
      background-position: right;
      background: url('~static/img/short-3-red.svg') no-repeat;
    }
  }

  .alert-cancel-refund-modal{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.7);
    .modal-content-refund{
      width: 400px;
      height: 220px;
      top: 50%;
      margin-top: -110px;
      background: white;
      position: absolute;
      margin-left: -200px;
      left: 50%;
      .modal-title{
        height: 50px;
        border-bottom: 1px solid #f4f4f4;
        width: 100%;
        line-height: 50px;
        span{
          display: inline-block;
          margin-left: 30px;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
        }
        .gz-icon-span{
          float: right;
          margin-right: 16px;
          color: #999999;
          cursor: pointer;
        }
        .gz-icon{

        }
      }
      .modal-content{
        padding: 14px 30px;
        p{
          font-size: 14px;
          line-height: 2.14;
          color: #333333;
        }
      }
      .modal-footer{
        margin-top: 20px;
        padding-left: 30px;
        .btn{
          width: 158px;
	        height: 42px;
          display: inline-block;
          line-height: 42px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
        }
        .btn-red{
          background-color: #ff4544;
        }
        .btn-grey{
          background-color: #908888;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
