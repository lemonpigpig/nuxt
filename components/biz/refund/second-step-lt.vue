<template lang="html">
  <div class="second-step-lt">
    <div class="edit-status" v-if="rmaDetail.status == 10">
      <p class="red">请耐心等待申请处理 同意或者驳回处理...</p>
      <p class="info">如果申请不同意，将告知原因并将本次申请关闭，如果还有问题，您可以在此发起申请。</p>
      <p class="info">如果有人以“卡单、系统有问题”为由给您发送退款相关链接，请勿相信，以免钱款被骗。</p>
    </div>
    <div class="reject-refund-status" v-if="rmaDetail.status == 25">
      <p class="time">{{rmaDetail.updateTime.replace('T', ' ')}}</p>
      <p class="reject">原因说明：{{rmaDetail.auditNote}}</p>
      <p class="reject">如果还有问题，您可以重新发起退货申请。您也可以联系客服（400-188-0871）。</p>
    </div>

    <div class="agree-refund-status" v-if="(rmaDetail.status == 20 && rmaDetail.type == 2) || rmaDetail.status == 26 || rmaDetail.status == 30">
      <p class="time">{{rmaDetail.updateTime.replace('T', ' ')}}</p>
      <div class="address-bar">
        <gz-icon icon="local" size="23"></gz-icon>
        <span v-if="rmaDetail.orderType == 2">{{rmaDetail.warehouseAddress}}（{{rmaDetail.warehouseReceiver}} 收）{{rmaDetail.warehouseMobile}}</span>
        <span v-if="rmaDetail.orderType != 2">请联系客服填写收货地址</span>
      </div>
    </div>

    <div class="user-cancel" v-if="rmaDetail.status == 60">
      <p class="info">您已撤销本次退款申请，如问题忍未解决，您可以重新发起申请。</p>
      <p class="info">建议您和国资商城确认沟通，避免后续产生误会。</p>
    </div>

    <div class="refund-success" v-if="rmaDetail.status == 40">
      <p class="title">您的订单已退款，款项已按原支付方式退回，预计1-15个工作日到账，届时请查看相关支付账号。</p>
      <p class="time">{{rmaDetail.updateTime.replace('T', ' ')}}</p>
      <div class="refund-bar">
        <div class="table-head">
          <span>退款总金额</span>
          <span>状态</span>
        </div>
        <div class="table-body">
          <span class="weight">¥{{Number(rmaDetail.amount).toFixed(2)}}</span>
          <span>已完成</span>
        </div>
      </div>
      <span class="other-choice">您还可以： <span class="new-link" @click="$router.push('/')">返回继续逛</span></span>
    </div>
    <div class="wait-refund" v-if="rmaDetail.status == 35 || (rmaDetail.status == 20 && rmaDetail.type == 1)">
      <p class="red">国资商城已经同意您的退款申请，请等待退款...</p>
      <p class="info">如果还有问题，您可以联系客服（400-188-0871）。</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rmaDetail: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style lang="less">
.second-step-lt{
  .edit-status,.wait-refund,.user-cancel{
    p{
      padding-left: 20px;
      font-size: 14px;
      line-height: 1.86;
    }
    p.red{
      padding-top: 22px;
      color: #ff4544;
    }
    p.info{
      color: #666666;
    }
  }
  .user-cancel{
    padding-top: 23px;
  }
  .reject-refund-status{
    p.time{
      font-size: 12px;
      padding-top: 18px;
      padding-left: 20px;
      color: #999999;
      line-height: 1.67;
      padding-bottom: 10px;
    }
    p.reject{
      font-size: 14px;
      line-height: 1.43;
      color: #b7a078;
      padding-left: 20px;
    }
  }
  .agree-refund-status{
    p.time{
      font-size: 12px;
      padding-top: 18px;
      padding-left: 20px;
      color: #999999;
      line-height: 1.67;
    }
    .address-bar{
      width: 836px;
      height: 52px;
      margin-left: 20px;
      margin-top: 11px;
      line-height: 52px;
      background-color: #eeeeee;
      .gz-icon{
            color: #b7a078;
            margin-left: 9px;
      }
      span{
        line-height: 52px;
        margin-left: 10px;
        color: #333333;
        font-size: 14px;
      }
    }

  }
  .refund-success{
    p.title{
      color: #333333;
      line-height: 1.43;
      font-size: 14px;
      font-weight: 600;
      padding-left: 20px;
      padding-top: 18px;
    }
    p.time{
      line-height: 1.67;
      color: #999999;
      font-size: 12px;
      padding-left: 20px;
    }
    span.other-choice{
      font-size: 14px;
      color: #333333;
      display: inline-block;
      margin-top: 34px;
      margin-left: 20px;
      margin-bottom: 36px;
      span.new-link{
        text-decoration: underline;
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .refund-bar{
      width: 860px;
    	height: 100px;
    	background-color: #dddddd;
      margin-top: 19px;
      margin-left: 20px;
      .table-head{
        padding-top: 24px;
        padding-left: 30px;
        span{
          display: inline-block;
          width: 175px;
          color: #333333;
          line-height: 1.43;
          font-size: 14px;
	        font-weight: 600;
        }
      }
      .table-body{
        padding-top: 14px;
        padding-left: 30px;
        span{
          display: inline-block;
          width: 175px;
          color: #333333;
          line-height: 1.43;
          font-size: 14px;
        }
        span.weight{
          font-weight: 600;
        }
      }
    }
  }
}
</style>
