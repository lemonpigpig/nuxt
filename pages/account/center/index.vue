<template lang="html">
    <div id="accountCenter">
        <div class="bread-crumb clearfix">
          <span class="current-loc">当前位置：</span>
          <span class="crumblist" v-for="(item, index) in breadCrumb">
            <span class="loc1"  :class="{'loc2' : index == breadCrumb.length-1}" @click="goPage('/account/center')">{{item.name}}</span>
            <gz-icon icon="go" size="9" v-if="index !== breadCrumb.length-1"/>
          </span>
        </div>
        <div class="wraper">
            <div class="menu-part">
                <menuLeft :flag='index'></menuLeft>
            </div>
            <div class="accountInfo">
                <h5 v-show="showTitle !== '管理收货地址' && showTitle !== '申请记录' && showTitle !== '订单查询' && showTitle !== '退款/退货申请' && showTitle !== ''">
                  <span>{{showTitle}}</span>
                  <input class="deleteAll" readonly="readonly" @click="showDeleteAllModal" v-show="showTitle === '我的收藏' && favoritesListData.length > 0" value="清空收藏"/>
                </h5>
                <keep-alive>
                    <component :is="currentView"></component>
                </keep-alive>
            </div>
        </div>
        <recommend-goods class="recommend-goods" :pageTypeKey="17" :positionKey="15"></recommend-goods>
        <alert-modal ref="deleteAllModal" @comfirm="comfirm">
          <div slot="modal-content">确认清空您的收藏夹吗？</div>
        </alert-modal>
    </div>
</template>

<script>
import _ from 'lodash'
import menuLeft from '~components/biz/sidebar/sidebar'
import modifyPwd from '~components/biz/account/modify-pwd'
import collection from '~components/biz/account/collection'
import myCoupon from '~components/biz/account/my-coupon'
import addressList from '~components/biz/address/address-list'
import rmaList from '~components/biz/rma/rma-list'
import orderDetal from '~pages/order/index'
import RecommendGoods from '~components/recommend-goods'
import AlertModal from '~components/alert-modal'

export default {
  data () {
    return {
      componentList: ['order-search', 'collect-list', 'address-list', 'modify-pwd', 'my-coupon', 'rma-search', 'rma-list', 'orderDetal', 'menuLeft']
    }
  },
  computed: {
    currentView () {
      if (this.$route.query.source && this.$route.query.source !== 'order-search' && this.$route.query.source !== 'rma-search') {
        return this.$route.query.source
      }
      return 'orderDetal'
    },
    showTitle () {
      if (this.currentView === 'collect-list') {
        return '我的收藏'
      } else if (this.currentView === 'modify-pwd') {
        return '修改密码'
      } else if (this.currentView === 'address-list') {
        return '管理收货地址'
      } else if (this.$route.query.type === '1') {
        return '订单查询'
      } else if (this.$route.query.type === '3') {
        return '退款/退货申请'
      } else if (this.currentView === 'rma-list') {
        return '申请记录'
      } else {
        return ''
      }
    },
    favoritesIdList () {
      return this.$store.state.account.favoritesIdList || []
    },
    favoritesListData () {
      return this.$store.state.account.favoritesList || {}
    },
    breadCrumb () {
      return !this.showTitle ? [{name: '账户中心'}] : [{name: '账户中心'}, {name: this.showTitle}]
    },
    index () {
      return _.findIndex(this.componentList, (item) => item === this.$route.query.source)
    }
  },
  methods: {
    DeleteAllHandler () {
      this.$store.dispatch('account/deleteFavouritesAll', this.favoritesIdList).then(() => {
        this.$store.commit('account/setFavoritesList', [])
        this.$store.commit('common/setMessage', '删除成功')
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    getCollectionList () {
      this.$store.dispatch('account/getFavoritesList').then(() => {
        this.formatData()
        this.$emit('sendIdList', this.favoritesListData.ids)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    goPage (url) {
      if (url) {
        this.$router.push({
          path: url
        })
      }
    },
    showDeleteAllModal () {
      this.$refs.deleteAllModal.showModal()
    },
    comfirm () {
      this.DeleteAllHandler()
      this.$refs.deleteAllModal.close()
    }
  },
  mounted () {
    this.axios.get('/users/coupons')
  },
  components: {
    menuLeft,
    orderDetal,
    rmaList,
    [collection.name]: collection,
    [modifyPwd.name]: modifyPwd,
    [addressList.name]: addressList,
    [RecommendGoods.name]: RecommendGoods,
    [AlertModal.name]: AlertModal,
    [myCoupon.name]: myCoupon
  }
}
</script>

<style lang="less">
#accountCenter {
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 80px;
  overflow: hidden;
  .bread-crumb{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;
    margin-bottom: 27px;
    height: 60px;
    font-size: 12px;
    .crumblist{
      display: flex;
      align-items: center;
    }
    .current-loc{
      color: #666666;
    }
    .loc1{
      color: #999999;
      cursor: pointer;
    }
    .gz-icon{
      margin: 0 6px;
    }
    .loc2{
      color: #333333;
      cursor: default;
    }
  }
  .wraper {
      overflow: hidden;
      margin-top: 27px;
      margin-bottom: 100px;
      width: 1200px;
      position: relative;
      z-index: 2;
      .menu-part {
          float: left;
          min-height: 700px;
          background: #f4f4f4;
      }
      .accountInfo {
          float: right;
          width: 996px;
          h5 {
          overflow: hidden;
          box-sizing: border-box;
          padding-left: 20px;
          padding-left: 10px;
          line-height: 36px;
          background: #ff4544;
          color: #fff;
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 20px;
            .deleteAll {
              margin-top: 8px;
              margin-right: 10px;
              text-align: center;
              float: right;
              font-size: 12px;
              font-weight: 500;
              width: 78px;
              padding-top: 3px;
              padding-bottom: 3px;
              background: #ff4544;
              color: #fff;
              border: 1px solid #fff;
            }
        }
      }
    }
    .recommend-goods {
      margin-bottom: 20px;
    }
}
</style>
