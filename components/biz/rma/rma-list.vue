<template lang="html">
  <div class="order-list">
    <div class="search-bar">
      <input type="text" name="" value="" class="search-input" v-model="queryCondition.condition.RmaSnOrOrderSn" placeholder="订单编号/退款编号">
      <button type="button" name="button" class="btn btn-red" @click="fetchData">查询</button>
    </div>
    <div class="goods-list">
      <div class="goods-list-content" v-for="item in rmaList.itemList">
        <span class="title">申请时间：{{item.createTime.replace('T', ' ')}}   退款编号：{{item.rmaSn}}</span>
        <div class="content">
          <div class="content-left">
            <div class="order-item" v-for="(child,childindex) in item.items" v-if="child.quantity">
              <div class="goods-content">
                <!-- -->
                <div  class="product-info" style="width:596px;cursor:pointer" @click="goGoodsDetail(child.goodId)">
                  <img :src="child.imageUrl" alt="">
                  <span><gz-tag backgroundColor="#ff4544" class="tag-item-order" v-if="child.itemType === 2"><span slot="tag-text">赠品</span></gz-tag>{{child.goodsName}}</span>
                </div>
                <div class="goods-num" style="width:100px;">
                  X{{child.quantity}}
                </div>
                <!--  -->
                <div class="goods-price" style="width:100px;">
                  <span class="price">¥{{child.totalPrice ? (Number(child.totalPrice)/Number(child.quantity)).toFixed(2) : 0}}</span>
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
            <div class="goods-oprate-1">
              <div class="">
                <span class="orange" v-if="item.items[0].rmaStatus == 10">待审核</span>
                <span class="orange" v-if="item.items[0].rmaStatus == 20 && item.rmaType == 2">待用户退货</span>
                <span  class="grey" v-if="item.items[0].rmaStatus == 60 || item.items[0].rmaStatus == 50">取消申请</span>
                <span  class="red" v-if="item.items[0].rmaStatus == 25">已驳回</span>
                <span  class="orange" v-if="(item.items[0].rmaStatus > 25 && item.items[0].rmaStatus < 40) || (item.items[0].rmaStatus == 20 && item.rmaType == 1)">处理中</span>
                <span  v-if="item.items[0].rmaStatus == 40">已完成</span>
                <a @click="goDetail(item.id)">退款单详情</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-order" v-if="showNoResult">
      <div class="">
        <img src="~assets/img/no-order.png" alt="">
        <h1 v-if="typeList[0].active">抱歉！您暂时还没有任何售后申请！</h1>
      </div>
    </div>
    <div class="page" v-if="rmaList && rmaList.itemList && rmaList.itemList.length">
        <pagination :paging="pagInfo" @setPage="updatePagination"></pagination>
    </div>
  </div>
</template>

<script>
import Tag from '~components/biz/tag/tag'
import Pagination from '~components/pagination'

export default {
  name: 'rma-list',
  components: {
    [Tag.name]: Tag,
    Pagination
  },
  data () {
    return {
      showNoResult: false,
      rmaList: {},
      pagInfo: {
        total: '',
        currentPage: 1,
        pageSize: 20,
        pageCount: ''
      },
      queryCondition: {
        'paging': {
          'pageSize': 10,
          'pageIndex': 1
        },
        'sort': [
          {
            'field': 0,
            'isDesc': true
          }
        ],
        'condition': {
          'RmaSnOrOrderSn': ''
        }
      }
    }
  },
  watch: {
    rmaList: {
      deep: true,
      handler (val) {
        if (val.itemList.length) {
          this.showNoResult = false
        } else {
          this.showNoResult = true
        }
      }
    },
    '$route': 'routeChange'
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('rma/getRmaList', this.queryCondition).then((data) => {
        this.$set(this, 'rmaList', Object.assign({}, data))
        this.$set(this.pagInfo, 'total', data.paging.total)
        this.$set(this.pagInfo, 'pageCount', data.paging.pageCount)
      })
    },
    routeChange () {
      if (this.$route.query.source === 'rma-list') {
        this.fetchData()
      }
    },
    goGoodsDetail (goodsId) {
      this.$router.push(`/goods/${goodsId}`)
    },
    goDetail (id) {
      this.$store.dispatch('rma/getRmaDetail', id).then((data) => {
        console.log(data)
      })
      window.open(`/refund/progress?rmaId=${id}`)
    },
    updatePagination (index) {
      if (index) {
        this.queryCondition.paging.pageIndex = index
        this.fetchData()
        // this.backToTop()
      }
    }
  }
}
</script>

<style lang="less">
.order-list{
  width: 996px;
  margin: 0 auto;
  .search-bar{
    display: flex;
    margin-bottom: 20px;
    input{
      font-size: 14px;
      font-weight: 300;
      padding-left: 20px;
      height: 36px;
      width: 360px;
      box-sizing: border-box;
      border: solid 1px #eeeeee;
    }
    .btn{
      width: 90px;
      height: 36px;
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
      float: right;
    }
  }
  .pre-sale-tag{
    background: #ff8d00;
    margin-right: 10px;
    display: inline !important;
    color: white !important;
    margin-left: 0 !important;
    padding: 3px;
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
              .line3{
                font-size: 14px;
                font-weight: 300;
                color: #ff4544;
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
                  width: 82px;
                  height: 82px;
                  border: 1px solid #f4f4f4;
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
          .goods-oprate-1{
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
              font-size: 12px;
              line-height: 1.5;
              cursor: pointer;
              color: #333333;
            }
            a:hover{
               color: #ff4544;
               text-decoration: none;
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
  .page {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
