<template lang="html">
  <div class="home-template" v-if="promotionList && promotionList.itemList && promotionList.itemList.length">
      <div class="template">
          <div class="template-title" v-if="source == 'home'">
            <div class="title-left">
              <span class="icon"><gz-icon icon="lightning" size="18"></gz-icon></span>
              <span class="title-name">秒杀 <span class="little-dot"></span> 限时抢购</span>
              <span class="title-content">总有你想不到的低价</span>
            </div>
            <div style="padding-right:10px;" @click="moreSale">
              <span class="more-sale"></span>
              <span class="more-sale-words">更多秒杀</span>
            </div>
          </div>
          <div class="template-content">
            <div class="goods-content" v-for="(item, index) in promotionList.itemList" @click="goGoodsDetail(item)">
                <div class="goods-left">
                  <div class="goods-img" :style="{backgroundImage:'url('+item.goodsImage+')'}">
                    <!-- <div :style="{backgroundImage:'url(http://10.66.1.113:8888/'+item.goodsImage+')'}"></div> -->
                  </div>
                </div>
                <div class="goods-right">
                  <span class="goods-title">{{item.goodsName}}
                    <!-- <span class="goods-title-tag" v-if="item.isTraceSource">溯源</span>
                    <span class="goods-title-tag" v-if="item.isPresale">预售</span> -->
                  </span>
                  <span class="goods-subtitle">{{item.introduction}}</span>
                  <div class="flex-content" >
                    <div class="progress">
                      <time-reverse :timer="getTimer(item.promotion.endTime)" :dayclass="`time-day`" :hourclass="`time time-hours`" :minclass="`time time-min`" :secondclass="`time time-sec`"></time-reverse>
                    </div>
                    <!-- <div class="progress">
                      <span class="time-day">5天</span>
                      <span class="time time-hours">20</span>
                      :
                      <span class="time time-min">20</span>
                      :
                      <span class="time time-sec">20</span>
                    </div> -->
                    <!-- <div class="progress-bar">
                      <div class="progress-background" :style="{ width:  Number(item.salesVolume)/(Number(item.salesVolume) + Number(item.stock))*100 + '%' }">

                      </div>
                      <div class="progress-word">已售{{item.salesVolume}}件 {{Number(item.salesVolume)/(Number(item.salesVolume) + Number(item.stock))}}%</div>
                    </div> -->
                  </div>

                  <div class="buy-content">
                    <div class="content-left">
                      <span class="price-line1">原价 ¥{{item.goodsPriceOriginal}}</span>
                      <span class="price-line2">限时价 ¥</span>
                      <span class="price-larger">{{item.goodsPrice}}</span>
                    </div>
                    <div class="content-right">
                      <span class="btn buy-now" :class="{'disabled' : item.stock <= 0}">{{item.stock<=0? '已售罄': '立即抢购'}}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
      <div class="page"  v-if="promotionList && promotionList.itemList && promotionList.itemList.length && source == 'flashsale'">
          <pagination :paging="pagInfo" @setPage="updatePagination"></pagination>
      </div>
  </div>
</template>

<script>
import moment from 'moment'
import TimeReverse from '~components/time.vue'
import Pagination from '~components/pagination'

export default {
  name: 'home-template',
  props: {
    source: {
      type: String,
      default () {
        return 'home'
      }
    }
  },
  components: {
    TimeReverse,
    Pagination
  },
  data () {
    return {
      pagInfo: {
        total: '',
        currentPage: 1,
        pageSize: 10,
        pageCount: ''
      },
      queryCondition: {
        'paging': {
          'pageSize': 4,
          'pageIndex': 1
        },
        'sort': [
          {'field': 12, 'isDesc': false}
        ],
        'condition': {}
      }
    }
  },
  computed: {
    promotionList () {
      return this.$store.state.promotion.promotionList
    }
  },
  methods: {
    fetchData () {
      // this.axios.post('/orders/payType')
      if (this.source === 'flashsale') {
        this.queryCondition.paging.pageSize = 10
      } else {
        this.queryCondition.paging.pageSize = 4
      }
      this.$store.dispatch('promotion/getPromotionList', this.queryCondition).then((data) => {
        this.$set(this.pagInfo, 'total', data.paging.total)
        this.$set(this.pagInfo, 'pageCount', data.paging.pageCount)
      })
    },
    getTimer (time) {
      const promotion = time
      let remainTime = 0
      remainTime = moment(promotion).format('X') - moment().format('X')
      return remainTime
    },
    goGoodsDetail ({ goodsId, stock }) {
      if (stock <= 0) {
        return
      }
      window.open(`/goods/${goodsId}`)
      // this.$router.push(`/goods/${goodsId}`)
    },
    moreSale () {
      window.open('/flashsale')
      // this.$router.push('/flashsale')
    },
    updatePagination (index) {
      if (index) {
        this.queryCondition.paging.pageIndex = index
        this.fetchData()
      }
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="less">
@keyframes progress-bar-stripes {
    from {
        background-position: 18px 0
    }
    to {
        background-position: 0 0
    }
}
.home-template{
  margin: 0;
  padding: 0;
  font-family: Hiragino Sans GB, Microsoft Yahei;
  .disabled{
    background: #ddd !important;
  }
  .page {
    text-align: center;
    margin-top: 67px;
  }
  .flex-content{
    display:flex;justify-content:space-between;align-items: center;
  }
  .template{
    width: 1200px;
    margin: 0 auto;
    background: white;
    .template-title{
        color: white;
        position: relative;
       height: 50px;
       background: url('~assets/img/Group 148.png');
       width: 100%;
       display: flex;
       align-items: center;
       justify-content: space-between;
       .title-left{
         display: flex;
        //  padding-left: 10px;
         align-items: baseline;
         .icon{
           border: 1px solid white;
           width: 18px;
           background: white;
           height: 18px;
           border-radius: 100px;
           display: flex;
           align-items: center;
           justify-content: center;
           margin: 0px 8px;
           .gz-icon{
             color: #ff4544 !important;
           }
         }
         .title-name{
           display: flex;
           align-items: center;
           font-size: 22px;
           font-weight: 100;
           text-align: center;
         }
         .little-dot{
           width: 6px;
           height: 6px;
           border-radius: 50%;
           display: inline-block;
           background: white;
           margin: 0 10px;
         }
         .title-content{
           font-size: 14px;
           text-align: justify;
           margin-left: 24px;
         }
       }
       .more-sale{
          // padding: 7px 13px;
          opacity: 0.4;
          font-size: 12px;
          width: 70px;
          height: 26px;
          cursor: pointer;
          display: inline-block;
          border-radius: 100px;
          background-color: #000000;

       }
       .more-sale-words{
         font-size: 12px;
         position: absolute;
         right: 19px;
         line-height: 26px;
         cursor: pointer;
         font-weight: 100;
       }
    }
    .template-content{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .goods-content:nth-last-child(2n){
        border-right: 1px solid #f4f4f4;
      }
      .goods-content{
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        width: 50%;
        border-bottom: 1px solid #f4f4f4;

        .goods-left{
            width: 200px;
            height: 200px;
            margin: 20px;
            margin-right: 0;
            .goods-img{
                width: 100%;
                height: 100%;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
        }
        .goods-right{
            padding-top: 20px;
            margin-right: 59px;
            text-align: left;
            flex-grow: 1;
            margin-left: 20px;
            .goods-title{
              font-size: 16px;
              font-weight: 600;
              color: #333333;
              display: block;
              width: 300px;
              .goods-title-tag{
                color: #ff4544;
                padding: 4px;
                border: 1px solid #ff4544;
                border-radius: 4px;
                font-size: 8px;
                font-weight: 100;
              }
            }
            .progress-bar{
              width: 140px;
              height: 20px;
              position: relative;
              background: #ffb5b2;

              .progress-background{
                background: url('~assets/img/Group 149.png');
                background-repeat: repeat-x;
                height: 20px;
                animation: reverse progress-bar-stripes 1s linear infinite, animate-positive 2s;
              }
              .progress-word{
                color: white;
                font-size: 12px;
                color: white;
                position: absolute;
                top: 1px;
                text-align: center;
                width: 100%;
                font-weight: 300;
              }
            }
            .progress{
              padding-top: 25px;
              padding-bottom: 30px;
              .time-day{
                font-size: 14px;
                font-weight: 600;
                color: #615548;
                margin-right: 7px;
              }
              .time{
                padding: 5px;
                text-align: center;
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                min-width: 16px;
              }
              .time-hours{
                background-color: #615548;
              }
              .time-min{
                background-color: rgba(97, 85, 72, 0.8);
              }
              .time-sec{
                background-color: rgba(97, 85, 72, 0.4);
              }
            }
            .buy-content{
              display: flex;
              margin-bottom: 50px;
              justify-content: space-between;
              .content-left{
                .price-line1{
                  font-size: 12px;
                  color: #999999;
                  display: block;
                  text-decoration: line-through;
                  font-family: Hiragino Sans GB, Microsoft Yahei;
                }
                .price-line2{
                  font-size: 14px;
                  font-weight: 600;
                  color: #ff4544;
                  font-family: Hiragino Sans GB, Microsoft Yahei;
                }
                .price-larger{
                  font-size: 22px;
                  font-weight: 600;
                  color: #ff4544;
                }
              }
              .content-right{
                .btn{
                  font-size: 14px;
                  font-weight: 600;
                  width: 140px;
                  height: 42px;
                  line-height: 42px;
                  display: block;
                  text-align: center;
                  color: #ffffff;
                  background-color: #ff4544;
                }
              }
            }
            .goods-subtitle{
              font-size: 14px;
              color: #999999;
              display: block;
            }
        }
      }
    }
  }

}
</style>
