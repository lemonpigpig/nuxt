<template lang="html">
  <div class="account-order">
    <div class="account-order-content">
      <!-- <side-bar v-show="iShowMenu" :flag="0"/> -->
      <div class="order-content">
        <div class="search-bar" v-show="!showUserInfo && $route.query.type != 3">
          <input type="text" name="" value="" class="search-input" v-model="queryCondition.orderSearch" placeholder="商品名称/订单编号">
          <button type="button" name="button" class="btn btn-red" @click="search">查询</button>
        </div>

        <div class="user-info-bar" v-show="showUserInfo && $route.query.type != 3">
          <div class="user-info">
            <div class="user-avator">
                <img src="~assets/img/Group 14.svg" alt="">
            </div>
            <div class="user-info-detail">
              <h2>欢迎您，<span class="strong">{{userName}}</span></h2>
              <div class="user-mobile-mail">
                <img src="~assets/img/mobile-account.png" alt="">
                <h3>手机: {{phone}}</h3>
              </div>
              <!-- <div class="user-mobile-mail">
                <img src="~assets/img/grey-mail-account.png" alt="">
                <h3>邮箱: <span class="not-bind">未绑定</span></h3>
              </div> -->
            </div>
          </div>
          <!-- <div class="sale-info">
            <div class="sale-info-item">
              <h2>优惠券</h2>
              <h2 style="margin-top:10px">0张</h2>
            </div>
            <div class="sale-info-item center-item">
              <h2>优惠券</h2>
              <h2 style="margin-top:10px">0张</h2>
            </div>
            <div class="sale-info-item">
              <h2>优惠券</h2>
              <h2 style="margin-top:10px">0张</h2>
            </div>
          </div> -->
        </div>

        <div class="order-list-index" :style="{'margin-top': $route.query.type == 3 ? '-10px' : '31px'}">
            <order-list ref="orderlist" @setActive="setActive" @showCancelModal="showCancelModal" @takeGoods="takeGoods" :orders="orderList"/>
        </div>
      </div>


    </div>
    <alert-modal ref="productAlertModal" @comfirm="comfirm">
      <div slot="modal-content">确定取消订单吗？</div>
    </alert-modal>
    <alert-modal ref="takeGoods" @comfirm="updateOrder">
      <div slot="modal-content">是否要确认收货？</div>
    </alert-modal>
    <!-- <div class="right-side-bar">
      <div class="item">
        在线客服
      </div>
      <div class="item grey" @click="goCart">
        <span>购物车 <span class="cart-num-label">{{cartSize}}</span></span>
      </div>
      <div class="item grey">
        我的收藏
      </div>
      <div class="item grey">
        反馈
      </div>
      <div class="item dark" @click="backToTop">
        返回顶部
      </div>
    </div> -->

    <div class="page" v-if="orderList && orderList.itemList && orderList.itemList.length">
        <pagination :paging="pagInfo" @setPage="updatePagination"></pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '~components/pagination'
import AlertModal from '~components/alert-modal'
import OrderList from '~components/biz/order'
import SideBar from '~components/biz/sidebar'
import BreadCrumb from '~components/biz/breadcrumb'

export default {
  components: {
    [SideBar.name]: SideBar,
    [OrderList.name]: OrderList,
    [AlertModal.name]: AlertModal,
    [BreadCrumb.name]: BreadCrumb,
    Pagination
  },
  data () {
    return {
      active: '', // 订单查询
      orderId: '',
      showSearch: false,
      testOrderList: {},
      searchCondition: '',
      queryCondition: {
        listType: 0,
        pageSize: 10,
        pageIndex: 1,
        orderSearch: ''
      },
      pagInfo: {
        total: '',
        currentPage: 1,
        pageSize: 20,
        pageCount: ''
      }
    }
  },
  watch: {
    '$route': 'test'
  },
  computed: {
    ...mapGetters({cartSize: 'cart/cartSize'}),
    orderList () {
      return this.$store.state.order.orderList
    },
    showUserInfo () {
      return !this.$route.query.type
    },
    searchBarState () {
      return this.$store.state.order.searchBarState
    },
    userName () {
      return this.$store.state.authorization.userName || ''
    },
    phone () {
      return this.$store.state.authorization.phone || ''
    }
  },
  methods: {
    test () {
      if (this.$route.query.source === 'order-search' || this.$route.query.source === 'rma-search') {
        this.fetchData(1)
      }
    },
    updatePagination (index) {
      if (index) {
        this.queryCondition.pageIndex = index
        this.fetchData(1)
        this.backToTop()
      }
    },
    setActive (state) {
      this.$route.query.type ? this.$router.replace(`/account/center?type=1&source=order-search&activeType=${state}`) : this.$router.replace(`/account/center?activeType=${state}`)
      this.queryCondition.listType = state
      this.queryCondition.pageIndex = 1
      this.fetchData()
    },
    showCancelModal (id) {
      this.$refs.productAlertModal.showModal()
      this.orderId = id
    },
    takeGoods (id) {
      this.$refs.takeGoods.showModal()
      this.orderId = id
    },
    search () {
      this.fetchData(1)
    },
    fetchData (type) {
      if (type) {
        this.queryCondition.listType = this.$route.query.activeType === undefined ? 0 : this.$route.query.activeType
        this.$refs.orderlist.setActiveStyle(this.$route.query.activeType ? this.$route.query.activeType : 0)
      }
      this.$store.dispatch('order/getOrder', this.queryCondition).then((data) => {
        this.$refs.orderlist.setActiveStyle(this.$route.query.activeType === undefined ? 0 : this.$route.query.activeType)
        this.$set(this.pagInfo, 'total', data.paging.total)
        this.$set(this.pagInfo, 'pageCount', data.paging.pageCount)
      })
    },
    goCart () {
      this.$router.push('/cart')
    },
    backToTop () {
      const timer = setInterval(() => {
        let distance,
          speed
        global.addEventListener('touchmove', () => {
          clearInterval(timer)
        })
        distance = document.body.scrollTop
        speed = Math.floor(-distance / 3)
        document.body.scrollTop = distance + speed
        if (distance === 0) {
          clearInterval(timer)
        }
      }, 30)
    },
    updateOrder () {
      this.$store.dispatch('order/confirmReceipt', this.orderId).then((data) => {
        if (data) {
          this.$refs.takeGoods.close()
          this.fetchData(1)
        }
      })
    },
    comfirm () {
      this.$store.dispatch('order/cancelOrder', this.orderId).then((data) => {
        if (data) {
          this.$refs.productAlertModal.close()
          this.fetchData(1)
        }
      })
    }
  },
  mounted () {
    //   account: '18217787153',
      // password: 'dsuyong521',
    // this.$store.commit('common/setBreadCrumbVisibility', true)
    // if (this.$route.query.type == 1) { // eslint-disable-line
    //   this.active = '订单查询'
    //   this.$store.commit('order/setShowSearchBarState', true)
    //   this.$store.commit('common/setBreadCrumbList', [{
    //     name: '账户中心',
    //     url: '/account/center'
    //   }, {
    //     name: '订单查询'
    //   }])
    // } else {
    //   this.active = ''
    //   this.$store.commit('order/setShowSearchBarState', false)
    //   this.$store.commit('common/setBreadCrumbList', [{
    //     name: '账户中心'
    //   }])
    // }
    this.fetchData(1)
  }
}
</script>

<style lang="less">
.account-order{
  margin-bottom: 136px;
  .account-order-content{
    width: 1200px;
    margin: 0 auto;
    display:flex;
  }
  // .right-side-bar{
  //   position: fixed;
  //   width: 36px;
  //   height: 200px;
  //   top: 109px;
  //   right: 0;
  //   div.item{
  //     width: 36px;
  //     height: 50px;
  //     box-sizing: border-box;
  //     background-color: #ff4544;
  //     border-bottom: 1px solid white;
  //     font-size: 12px;
  //     color: #ffffff;
  //     display: flex;
  //     text-align: center;
  //     justify-content: center;
  //     cursor: pointer;
  //     align-items: center;
  //     .cart-num-label{
  //       background: #ff4544;
  //       font-size: 10px;
  //       padding: 0 4px;
  //       border-radius: 5px;
  //       margin-left: -5px;
  //       text-align: center;
  //     }
  //   }
  //   div.grey{
  //     background-color: #908888;
  //   }
  //   div.dark{
  //     background-color: #591616;
  //   }
  // }
  .user-info-bar{
      width: 996px;
      height: 120px;
      box-sizing: border-box;
      border: 1px solid #f4f4f4;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 53px;
      .user-info{
        height: 80px;
        box-sizing: border-box;
        margin-left: 10px;
        display: flex;
        align-items: center;
        .user-avator{
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid #dddddd;
          margin-left: 23px;
        }
        .user-info-detail{
          margin-top: 31px;
          margin-left: 23px;
          margin-bottom: 20px;
          h2{
            font-size: 14px;
            color: #333333;
            margin-bottom: 10px;
            font-weight: 300;
            span.strong{
              font-weight: 600;
            }
          }
          .user-mobile-mail{
            display: flex;
            align-items: center;
            margin-bottom: 7px;
            img{
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
            h3 {
              font-weight: 300;
              font-size: 12px;
              color: #333333;
              .not-bind{
                color: #ff4544;
              }
            }
          }

        }
      }
      .sale-info{
        width: 548px;
        height: 100px;
        background: #f8f8f8;
        display: flex;
        align-items: center;
        .center-item{
          border-left: 1px solid #dddddd;
          border-right: 1px solid #dddddd;
        }
        .sale-info-item{
          width: 180px;
          box-sizing: border-box;
          text-align: center;

          h2{
            font-size: 14px;
            color: #333333;
            font-weight: 300;
          }

        }
      }
  }

  .order-content{
    // margin-left: 20px;
    .search-bar{
      display: flex;
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
    .order-list-index{
      margin-top: 31px;
    }
  }
  .page {
    text-align: center;
    margin-top: 20px;
  }
}

</style>
