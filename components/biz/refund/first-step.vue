<template lang="html">
  <div class="first-step-refund" @click="showReasonList(false)">
    <div class="choose-type">
      <div class="choose-type-title">
        <span>退款申请服务</span>
      </div>
      <div class="choose-type-content">
        <div class="goods-list">
          <div class="goods-item" v-for="item in refundDetail.items" v-if="item.quantity > 0">
            <img :src="item.image" alt="">
            <div class="goods-info">
              <span class="goods-title"><span class="gift-good" v-if="item.itemType==2">赠品</span>{{item.goodsName}}</span>
              <span class="goods-price" v-if="item.itemType !==2">¥{{(item.payPrice || item.payPrice == 0 ) ? Number(item.payPrice).toFixed(2) : Number(item.price).toFixed(2)}}</span>
              <span class="goods-price" v-if="item.itemType ==2">¥0.00</span>
              <span class="goods-num">×{{item.quantity}}件</span>
            </div>
            <div class="clear-float"></div>
          </div>
        </div>

        <div class="refund-form">

          <div class="control-modal">
            <span class="refund-reason">退款原因：</span>
            <div class="select-box" @click="showReasonList(true, $event)">
              <span class="select-value">{{reason.reason == '' ? '请选择原因' : reason.reason}}</span>
              <img src="~static/img/combined-shape.svg" alt="">
              <div class="select-options" v-if="showRlist" >
                <ul>
                <li v-for="item in reasonList" @click="setReason(item, $event)"><span>{{item.reason}}</span></li>
                </ul>
              </div>
            </div>
            <div class="clear-float"></div>
          </div>

          <div class="control-modal" style="margin-top: 23px;" >
            <span class="refund-reason">退款金额：</span>
            <div class="input-box">
              <input class="refund-price" v-model="amount" type="number" name="" value="">
              <span>元</span>
            </div>
            <span class="refund-info">最多{{refundDetail.suggestPrice}}元</span>
            <!-- 含发货邮费{{Number(refundDetail.freight).toFixed(2)}}元 -->
            <!-- <span class="alert-icon" v-if="!$route.query.rmaId">!</span> -->
            <span class="refund-new-link">退款金额不得大于商品实际支付金额（不含优惠券、红包、积分等抵扣金额）</span>
          </div>

          <div class="control-modal" style="margin-top: 24px;">
            <span class="refund-reason">说明：
              <div class="" style="margin-top: -15px;">
                <span class="word-num">({{note.length}}/200字)</span>
              </div>
            </span>
            <textarea name="name" v-model="note" maxlength="200"></textarea>
          </div>

          <div class="control-modal" style="margin-top: 35px;height:auto;">
            <span class="refund-reason upload-file">上传凭证：</span>
            <div class="file-box">
              <input type="file" class="files" ref="gzfile" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="changeHandler" multiple/>
              <div class="file-btn">
                <span>选择凭证图片</span>
              </div>
            </div>
            <!-- <div class="upload-file-div" v-if="!$route.query.rmaId">
              <span class="alert-icon">?</span>
            </div> -->
            <div class="upload-file-div">
              <span class="refund-new-link upload-file">最多可上传5张图片，每张图片大小不超过5M，支持bmp,gif,jpg,png,jpeg格式文件</span>
            </div>
            <div class="clear-float"></div>
            <div class="img-list">
              <div class="img-item" v-for="(img, index) in attachments">
                <img :src="img" alt="">
                <div class="modal" @click="removeImg(index)">
                  删除
                </div>
              </div>
              <div class="clear-float"></div>
            </div>
          </div>

          <div class="button-bar">
            <span class="btn btn-red" @click="submitApply()">{{$route.query.rmaId ? '提交申请' : '保存修改' }}</span>
            <span class="btn btn-white" @click="goBack()">取消并返回</span>
          </div>
        </div>
      </div>
    </div>
    <service-info></service-info>
  </div>

</template>

<script>
import ServiceInfo from '~components/biz/refund/service-info.vue'
import imgDeal from '~components/biz/upload/upload.js'
export default {
  props: {
    refundDetail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    ServiceInfo
  },
  data () {
    return {
      reasonList: [],
      showRlist: false,
      reason: {
        id: '',
        reason: ''
      },
      amount: '',
      note: '',
      uploadPath: '',
      attachments: [],
      flag: true
    }
  },
  methods: {
    changeHandler () {
      const length = this.$refs.gzfile.files.length
      let hzList = ['gif', 'jpeg', 'jpg', 'png', 'svg']
      if (length + this.attachments.length > 5) {
        this.$store.commit('common/setMessage', '最多只能上传五张图片')
      } else {
        this.$store.dispatch('common/getUpload').then((url) => {
          for (var key in this.$refs.gzfile.files) {
            if (!isNaN(key)) {
              let hzName = this.$refs.gzfile.files[0].name.split('.')
              if (hzList.indexOf(hzName[hzName.length - 1]) === -1) {
                this.$store.commit('common/setMessage', '只能上传图片')
              } else {
                imgDeal.upload(url, this.$refs.gzfile.files[key], (res) => {
                  if (this.attachments.length < 5) {
                    this.attachments.push(`http://10.66.1.113:8888/${res[0].file}`)
                  }
                })
              }
            }
          }
        })
      }
    },
    submitApply () {
      const param = {
        orderId: this.$route.query.orderId,
        type: this.$route.query.type,
        items: this.refundDetail.items,
        reason: this.reason.id,
        amount: this.amount,
        note: this.note,
        attachments: this.attachments
      }
      param.id = this.$route.query.rmaId
      if (this.checkVal()) {
        this.$store.dispatch(this.$route.query.rmaId ? 'rma/editRefund' : 'rma/submitRefund', param).then((data) => {
          this.$emit('subimtRefund', data)
        }).catch((err) => {
          this.$store.commit('common/setMessage', err)
          this.$emit('subimtRefund', err)
        })
      }
    },
    checkVal () {
      if (this.reason.id === '') {
        this.$store.commit('common/setMessage', '请选择退款原因')
      } else if (this.amount === '') {
        this.$store.commit('common/setMessage', '请填写退款金额')
      } else if (this.amount > this.refundDetail.suggestPrice || this.amount < 0) {
        this.$store.commit('common/setMessage', '金额填写有误')
      } else {
        return true
      }
    },
    removeImg (index) {
      this.attachments.splice(index, 1)
    },
    getReason () {
      this.$store.dispatch('rma/getRefundReason').then((data) => {
        for (var i in data) {
          this.reasonList.push({ id: i, reason: data[i] })
        }
      })
    },
    showReasonList (status, event) {
      if (status) {
        this.showRlist = !this.showRlist
      } else {
        this.showRlist = status
      }
      if (event) {
        event.stopPropagation()
      }
    },
    goBack () {
      this.$emit('cancelSave')
    },
    setReason (reason, event) {
      event.stopPropagation()
      this.showRlist = false
      this.reason = reason
    }
  },
  watch: {
    refundDetail: {
      deep: true,
      handler (val) {
        if (this.$route.query.rmaId) {
          this.$set(this.reason, 'reason', val.reasonText)
          this.$set(this.reason, 'id', val.reason)
          this.$set(this, 'amount', val.amount)
          this.$set(this, 'note', val.note)
          if (val.attachments.length) {
            val.attachments.forEach((img) => {
              this.attachments.push(img.path)
            })
          }
        }
      }
    }
  },
  mounted () {
    this.getReason()
  }
}
</script>

<style lang="less">
.first-step-refund{
  .choose-type{
    width: 1200px;
    height: auto;
    border: 1px solid #f4f4f4;
    margin: 0 auto;
    box-sizing: border-box;
    margin-top: 12px;
    margin-bottom: 37px;
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
      border-bottom: 1px solid #f4f4f4;
      .goods-list{
        .goods-item{
          margin-bottom: 28px;
        }
        .goods-item:last-child{
          margin-bottom: 0;
        }
        img{
          width: 82px;
          height: 82px;
          border: 1px solid #f4f4f4;
          float: left;
        }
        .goods-info{
          display: inline-block;
          margin-left: 37px;
          max-width: 800px;
          span{
            display: block;
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
          .goods-title{
            font-size: 14px;
            line-height: 1.29;
            color: #333333;
          }
          .goods-price{
            font-size: 16px;
            font-weight: 600;
            line-height: 1.13;
            color: #333333;
            margin-top: 5px;
          }
          .goods-num{
            font-size: 12px;
            color: #666666;
            margin-top: 18px;
          }
        }
      }
      .refund-form{
        box-sizing: border-box;
        padding-top: 48px;
        .alert-icon{
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #d7d7d7;
          text-align: center;
          line-height: 16px;
          color: #999999;
          font-size: 12px;
          margin-left: 30px;
        }
        .upload-file{
          line-height: 60px !important;
        }
        .upload-file-div{
          height:60px;line-height:60px;float:left;display:inline-block;
        }
        .control-modal{
          span.refund-reason{
            width: 75px;
            display: inline-block;
            text-align: right;
            font-size: 14px;
            line-height: 36px;
            color: #333333;
            float: left;
            .word-num{
              color: #999999;
              font-size: 12px;
              display: inline-block;
              width: 100%;
            }
          }
          textarea{
            width: 742px;
            height: 80px;
            background-color: #ffffff;
            border: solid 1px #cccccc;
            margin-left: 10px;
            resize: none;
            padding: 10px;
          }
          .file-box{
            margin-left: 10px;
            margin-top: 10px;
            display: inline-block;
            width: 140px;
            float: left;
            cursor: pointer;
            height: 36px;
            input{
              width: 140px;
              height: 36px;
              opacity: 0;
              cursor: pointer;
              display: inline-block;
            }
            .file-btn{
              width: 140px;
              height: 36px;
              background-color: #f4f4f4;
              border: solid 1px #cccccc;
              line-height: 36px;
              margin-top: -36px;
              font-size: 14px;
              text-align: center;
            }
          }
          .select-box{
            width: 212px;
            height: 36px;
            cursor: pointer;
            border: solid 1px #cccccc;
            background-color: #ffffff;
            display: inline-block;
            box-sizing: border-box;
            position: relative;
            margin-left: 10px;
            img{
              float: right;
              margin-top: 12px;
              margin-right: 10px;
            }
            .select-options{
              position: absolute;
              width: 212px;
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
              color: #333333;
              line-height: 36px;
              padding-left: 9px;
            }
          }
          .input-box{
            width: 212px;
            height: 36px;
            cursor: pointer;
            border: solid 1px #cccccc;
            background-color: #ffffff;
            display: inline-block;
            box-sizing: border-box;
            margin-left: 10px;
            .refund-price{
              border: none;
              outline: none;
              height: 34px;
              line-height: 34px;
              width: 180px;
              margin-top: -6px;
              padding-left: 10px;
            }
            span{
              line-height: 36px;
              color: #999999;
              font-size: 16px;
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
            input[type="number"]{
                -moz-appearance: textfield;
            }
          }
          .refund-info{
            font-size: 14px;
            line-height: 36px;
            margin-left: 15px;
            color: #333333;
          }

          .refund-new-link{
            font-size: 14px;
            line-height: 36px;
            color: #999999;
            cursor: default;
            margin-left: 33px;
          }
          .img-list{
            display: block;
            margin-left: 85px;
            margin-top: 10px;
            .img-item{
              float: left;
              margin-right: 30px;
              display: inline-block;
              position: relative;
              img{
                width: 60px;
                height: 60px;
                border: solid 1px #f4f4f4;
                display: inline-block;
                cursor: pointer;
              }

              .modal{
                width: 60px;
                height: 60px;
                background-color: rgba(0, 0, 0, 0.3);
                color: #ffffff;
                font-size: 12px;
                text-align: center;
                line-height: 60px;
                // margin-top: -63px;
                position: absolute;
                top: 0;
                cursor: pointer;
                display: none;
              }
            }
            .img-item:hover .modal{
              display: block;

            }
          }
        }
        .button-bar{
          margin-top: 58px;
          margin-left: 88px;
          .btn{
            width: 160px;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            display: inline-block;
            text-align: center;
            cursor: pointer;
          }
          .btn-red{
            background-color: #ff4544;
            color: white;
          }
          .btn-white{
            color: #b7a078;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
