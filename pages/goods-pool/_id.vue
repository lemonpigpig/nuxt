<template>
  <div class="category">
    <div class="wrapper">
      <div class="category__search fn-clear category__margin">
        <template>
          <span class="search__keyword"><strong>全部结果</strong></span> 商品筛选 共{{paging.total}}个商品
          <span class="search__info">{{ruleList.join(', ')}}</span>
        </template>
      </div>
      <div class="fn-clear">
        <div class="category__goods" ref="goodList" style="width: 100%">
          <div class="category__header category__order">
            <span class="order__current">排序：</span>
            <span :class="[sort[0].field === 0 ? 'order__current' : '', 'order__item']"
                  @click="updateSort(0)">默认排序</span>
            <span class="order__item" @click="updateSort(2)">
              销量
              <gz-icon :class-name="['order__up', sort[0].field === 2 && !sort[0].isDesc ? 'order__current' : '']"
                       icon="order-up" size="5"></gz-icon>
              <gz-icon :class-name="['order__down', sort[0].field === 2 && sort[0].isDesc ? 'order__current' : '']"
                       icon="order-down" size="5"></gz-icon>
            </span>
            <span class="order__item" @click="updateSort(1)">
              价格
              <gz-icon :class-name="['order__up', sort[0].field === 1 && !sort[0].isDesc ? 'order__current' : '']"
                       icon="order-up" size="5"></gz-icon>
              <gz-icon :class-name="['order__down', sort[0].field === 1 && sort[0].isDesc ? 'order__current' : '']"
                       icon="order-down" size="5"></gz-icon>
            </span>
          </div>

          <div class="goods ft-center fn-clear">
            <div class="category__no-data" v-if="goodsList.length === 0">
              <gz-icon color="#FF8D00" size="40" icon="no-data"></gz-icon>
              抱歉！没有获取到相关的数据哦～
            </div>
            <div v-for="item in goodsList" class="goods__item-fullcut">
              <goods-item :showDesc="true" :showCollection="true" :item="item"
                          height="324px" width="240px"/>
            </div>
          </div>

          <div class="category__pagination" v-if="goodsList.length > 0">
            <pagination :paging="paging" @setPage="updatePagination"></pagination>
          </div>
        </div>
      </div>
      <div class="go-cart-wrap">
        <div class="go-cart-left">
          <!-- <p class="go-cart-promotionMsg">满赠|满9.90、19.90、29.90可换购商品</p> -->
        </div>
        <div class="go-cart-right">
          <!-- <div class="right-content">
            <p class="price-total">
              <span>小计：</span>
              <span class="price-total-num" v-if="cartInfo.totalPrice">¥{{cartInfo.totalPrice}}</span>
            </p>
            <p class="right-promotionMsg">快去选购商品参加促销活动吧</p>
          </div> -->
          <div class="go-cart-btn" @click="goCart">
            去购物车结算
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import GoodsItem from '~components/goods-item'
  import Pagination from '~components/pagination'

  // set default sort rule
  const SORT = [
    {
      'field': 0,
      'isDesc': true
    }
  ]
  const PAGE_SIZE = 20

  export default {
    components: {
      [GoodsItem.name]: GoodsItem,
      Pagination
    },
    data () {
      return {
        isLoading: false,
        sort: SORT,
        paging: {
          currentPage: 1,
          pageSize: PAGE_SIZE,
          pageCount: 1
        },
        filters: [],
        goodsList: [],
        condition: {}
      }
    },
    computed: {
      ...mapGetters({cartInfo: 'cart/getCartTotalInfo'}),
      promotionList () {
        return this.$store.state.cart.promotionList || []
      },
      ruleList () {
        const list = []
        const id = this.$route.params.id
        const current = this.promotionList.filter(item => item.promotionId === id)
        if (current && current.length === 1) {
          const rules = current[0].promotionRuleList
          rules.forEach((rule) => {
            if (rule.giftList && rule.giftList.length > 0) {
              list.push(`满${rule.threshold}送赠品`)
            } else {
              list.push(`满${rule.threshold}减${rule.reduceAmount}`)
            }
          })
        }
        return list
      }
    },
    methods: {
      goGood (id) {
        window.open(`/goods/${id}`)
      },
      updatePagination (currentPage) {
        if (this.isLoading) {
          return false
        }
        this.paging.currentPage = currentPage
        this.update()
      },
      updateSort (field) {
        if (this.isLoading || (this.sort[0].field === 0 && field === 0)) {
          return false
        }
        const sort = {
          'field': field
        }

        if (field === 0) {
          sort.isDesc = true
        } else {
          sort.isDesc = !this.sort[0].isDesc
        }

        this.sort = [sort]

        this.update()
      },
      update () {
        if (!this.paging) {
          return false
        }
        this.isLoading = true
        this.queryGoods()
      },
      queryGoods () {
        const id = this.$route.params.id ? this.$route.params.id : 0
        const type = this.$route.query.type ? this.$route.query.type : 0
        if (id && type) {
          this.$store.dispatch('promotion/getPoolGoodsBytype', {
            paging: {
              pageSize: PAGE_SIZE,
              pageIndex: this.paging.currentPage
            },
            sort: this.sort,
            condition: {
              PromotionId: Number(id),
              PromotionType: Number(type)
            }
          }).then((res) => {
            this.goodsList = this.transGoods(res.itemList)
            this.paging = res.paging
            this.isLoading = false
          })
        }
      },
      transGoods (list) {
        list.forEach(item => {
          this.$set(item, 'status', item.goodsStatus)
          this.$set(item, 'name', item.goodsName)
          this.$set(item, 'imageCover', item.goodsImage)
        })
        return list
      },
      goCart () {
        window.open('/cart')
      }
    },
    mounted () {
      this.$set(this.paging, 'currentPage', 1)
      const id = this.$route.params.id ? this.$route.params.id : 0
      const type = this.$route.query.type ? this.$route.query.type : 0
      if (id && type) {
        this.queryGoods()
      }
      if (!this.promotionList || this.promotionList.length === 0) {
        this.$store.dispatch('cart/getMergedCart')
      }
    }
  }
</script>

<style lang="less">
  .go-cart-wrap {
    border: 1px solid #dddddd;
    background: #fff;
    font-size: 12px;
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
      clear: both;
    }
    .go-cart-left {
      padding-top: 13px;
    }
    .go-cart-left {
      float: left;
      padding-left: 54px;
    }
    .go-cart-promotionMsg {
      color: #ff4544;
       border: solid 1px #ff4544;
       padding: 6px 35px;
    }
    .go-cart-right {
      float: right;
      .right-content, .go-cart-btn {
        display: inline-block;
        vertical-align: top;
      }
      .right-content {
        padding-top: 9px;
      }
      .price-total {
        font-size: 16px;
      }
      .price-total-num {
        color: #ff4544;
        font-size: 18px;
        font-weight: 600;
      }
      .right-promotionMsg {
        color: #999999;
      }
      .go-cart-btn {
        background: #ff4544;
        color: #fff;
        padding: 17px 44px;
        font-size: 16px;
        cursor: pointer;
        margin-left: 22px;
      }
    }

  }
</style>
