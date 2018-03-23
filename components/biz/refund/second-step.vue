<template lang="html">
  <div class="second-step-refund">
    <div class="apply-left">
      <div class="apply-left-title" v-if="rmaDetail.status == 10">
        请等待处理...
      </div>
      <div class="apply-left-title" v-if="rmaDetail.status == 26 || rmaDetail.status == 30">
        退货中，待商家确认审核
      </div>
      <div class="apply-left-title" v-if="(rmaDetail.status == 20 && rmaDetail.type == 2) ">
        同意退货退款处理，请退货
      </div>
      <div class="apply-left-title" v-if="rmaDetail.status == 25 || rmaDetail.status == 31">
        已驳回申请
      </div>
      <div class="apply-left-title" v-if="rmaDetail.status == 60 || rmaDetail.status == 50">
        退款关闭
      </div>
      <div class="apply-left-title" v-if="rmaDetail.status == 40">
        已完成
      </div>
      <div class="apply-left-title" v-if="(rmaDetail.status == 20 && rmaDetail.type == 1) || rmaDetail.status == 35 ">
        已同意申请
      </div>
      <div class="apply-left-content" :style="{'height': rmaDetail.status !== 40 ? '139px' : 'auto'}">
        <second-step-lt :rmaDetail="rmaDetail"></second-step-lt>
      </div>
      <div class="apply-left-bottom" v-if="rmaDetail.status !== 40">
        <second-step-lb @editRefund="editRefund" :rmaDetail="rmaDetail" @showModal="showModal" @submitRefundShipping="submitRefundShipping"></second-step-lb>
      </div>
    </div>
    <div class="apply-right">
      <div class="apply-right-content">
        <div class="goods-list">
          <div class="goods-item" v-for="item in rmaDetail.items" v-if="item.quantity > 0">
            <img :src="item.image" alt="">
            <div class="goods-info">
              <p><span class="gift-good" v-if="item.itemType == 2">赠品</span>{{item.goodsName}}</p>
              <span class="price">¥{{Number(item.price).toFixed(2)}}／件</span>
              <span class="number">{{item.quantity}}件</span>
            </div>
            <div class="clear-float"></div>
          </div>
        </div>
      </div>
      <div class="apply-right-bottom">
        <div class="control-modal">
          <span class="title">退款编号</span>：
          <span class="detail">{{rmaDetail.rmaSn}}</span>
        </div>
        <div class="control-modal">
          <span class="title">退款金额</span>：
          <span class="detail">{{Number(rmaDetail.amount).toFixed(2)}}元</span>
        </div>
        <div class="control-modal">
          <span class="title">原因</span>：
          <span class="detail">{{rmaDetail.reasonText}}</span>
        </div>
        <div class="control-modal">
          <span class="title">要求</span>：
          <span class="detail">{{rmaDetail.typeText}}</span>
        </div>
        <div class="control-modal">
          <span class="title">申请状态</span>：
          <span class="detail status orange" v-if="rmaDetail.status == 10">待审核</span>
          <span class="detail status orange" v-if="rmaDetail.status == 20 && rmaDetail.type == 2">待用户退货</span>
          <span class="detail status grey" v-if="rmaDetail.status == 60 || rmaDetail.status == 50">取消申请</span>
          <span class="detail status red" v-if="rmaDetail.status == 25">已驳回</span>
          <span class="detail status orange" v-if="rmaDetail.status > 25 && rmaDetail.status < 40 || (rmaDetail.status == 20 && rmaDetail.type == 1)">处理中</span>
          <span class="detail status" v-if="rmaDetail.status == 40">已完成</span>
        </div>
      </div>
    </div>
    <div class="clear-float"></div>
  </div>
</template>

<script>
import SecondStepLt from './second-step-lt.vue'
import SecondStepLb from './second-step-lb.vue'
export default {
  components: {
    SecondStepLt,
    SecondStepLb
  },
  props: {
    rmaDetail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    editRefund () {
      this.$emit('editRefund')
    },
    showModal () {
      this.$emit('showModal')
    },
    submitRefundShipping (data) {
      this.$emit('submitRefundShipping', data)
    }
  }
}
</script>

<style lang="less">
.second-step-refund{
  position: relative;
  .clear-float{
    clear: both;
  }
  span.gift-good{
    font-size: 12px;
    color: white;
    background: #ff4544;
    padding: 3px;
    display: inline;
    margin-right: 5px;
    font-weight: 300;
  }
  width: 1200px;
  margin: 12px auto 117px;
  border: 1px solid #f4f4f4;
  .apply-left{
    display: inline-block;
    float: left;
    width: 899px;
    &-title{
      height: 44px;
      line-height: 44px;
      color: #333333;
      font-size: 16px;
	    font-weight: 600;
      border-bottom: 1px solid #f4f4f4;
      padding-left: 20px;
    }
    &-content{
      height: 139px;
      // border-bottom: 1px solid #f4f4f4;

    }
    &-bottom{
      padding: 51px 20px 0;
      border-top: 1px solid #f4f4f4;

    }
  }
  .apply-right{
    display: inline-block;
    border-left: 1px solid #f4f4f4;
    box-sizing: border-box;
    // position: absolute;
    // height: 100%;
    &-content{
      border-bottom: 1px solid #f4f4f4;
      width: 298px;
      box-sizing: border-box;
      .goods-list{
        padding: 14px 0 0 20px;
        .goods-item{
          margin-bottom: 30px;
          img{
            width: 60px;
            height: 60px;
            box-sizing: border-box;
            border: 1px solid #f4f4f4;
            display: inline-block;
            float: left;
          }
          .goods-info{
            display: inline-block;
            p{
              font-size: 12px;
              line-height: 1.5;
              color: #333333;
              padding-right: 8px;
              padding-left: 10px;
              max-width: 210px;
            }
            .price{
              color: #333333;
              font-size: 12px;
              line-height: 1.5;
              margin-left: 10px;
            }
            .number{
              font-size: 12px;
              color: #666666;
              margin-left: 53px;
            }
          }
        }
      }
    }
    &-bottom{
      padding: 17px 20px;
      .control-modal{
        span{
          font-size: 14px;
          color: #333333;
          line-height: 1.86;
        }
        .title{
          text-align: justify;
          text-align-last: justify;
          width: 60px;
          display: inline-block;
        }
        .status{
          color: #ff8d00;
        }
        .orange{
          color: #ff8d00;
        }
        .grey{
          color: #cccccc;
        }
        .red{
          color: #ff4544;
        }
      }
    }
  }
}
</style>
