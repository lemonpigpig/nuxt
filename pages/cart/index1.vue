<template>
  <div id="cart">
    <pay-header :progressinfo="stepinfo" v-if="this.cartSize > 0"></pay-header>
    <div class="wrapper">
      <div v-if="this.cartSize > 0">
        <div class="heading uk-flex uk-flex-middle uk-flex-space-between">
          <div class="allCheck">
            <label>
              <input type="checkbox"
                v-model="checkedAll"/>
            </label>
          </div>
          <div class="uk-flex uk-flex-space-between uk-flex-item-1">
            <div class="checkAll">全选</div>
            <div class="goodsName">商品名称</div>
            <div class="goodsPrice uk-flex-item-1">单价</div>
            <div class="goodsNum">数量</div>
            <div class="goodsSum uk-flex-item-1">小计</div>
            <div class="operate uk-flex-item-1">操作</div>
          </div>
        </div>
        <div class="goodlist" >
          <div class="valid uk-flex uk-flex-wrap-top uk-flex-space-between" v-for="(item, index) in customCartList">
            <div class="allCheck uk-flex uk-flex-wrap-top">
              <input type="checkbox" :checked="item.checked || checkedAll" v-model="checkedIds" :value="item.goodsId"/>
            </div>
            <div class="divisionLine uk-flex uk-flex-space-between uk-flex-item-1">
              <div class="goodsImage">
                <nuxt-link :to="`/goods/${item.goodsId}`"><img :src="item.goodsImage"/></nuxt-link>
              </div>
              <div class="goodsName">
                <a :href="`/goods/${item.goodsId}`">{{item.goodsName}}</a>
                <div class="presale" v-if="item.isPresale">
                  <gz-icon icon="info1" size="16"/>预计{{presaleTime(item.presaleTime)}}发货
                </div>
              </div>
              <div class="goodsPrice uk-flex-item-1" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{item.computedPrice}}</div>
              <div class="goodsNum">
                <change-number
                  :index="index"
                  :goodsQuantity="item.goodsQuantity"
                  :increment="item.increment"
                  :minLimit="item.minLimit"
                  :goodsLimit="item.goodsLimit"
                  :goodsId = "item.goodsId"
                  :item="item">
                </change-number>
              </div>
              <div class="goodsSum uk-flex-item-1" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥<span>{{item.goodsTotalPrice}}</span></div>
              <div class="operate uk-flex-item-1">
                <a @click="addGoodsToFavorite(item.goodsId)">移入收藏夹</a>
                <!-- <div><a @click="deleteGood(item.goodsId)">删除</a></div> -->
                <div><a @click="showConfirmModal(0, item.goodsId)">删除</a></div>

              </div>
            </div>
          </div>
          <div class="invalid uk-flex uk-flex-wrap-top uk-flex-space-between" v-for="(item, index) in invalidCartList">
            <div class="allCheck uk-flex uk-flex-wrap-to">
              <span class="invalid-tag">失效</span>
            </div>
            <div class="uk-flex uk-flex-space-between uk-flex-item-1">
              <div class="goodsImage">
                <img :src="item.goodsImage"/>
              </div>
              <div class="goodsName">
                <p>{{item.goodsName}}</p>
              </div>
              <div class="goodsPrice uk-flex-item-1" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{item.computedPrice}}</div>
              <div class="goodsNum">{{item.goodsQuantity}}</div>
              <div class="goodsSum uk-flex-item-1">¥<span>{{item.goodsTotalPrice}}</span></div>
              <div class="operate uk-flex-item-1">
                <a @click="addGoodsToFavorite(item.goodsId, 1)">移入收藏夹</a>
                <div><a @click="showConfirmModal(0, item.goodsId)">删除</a></div>
              </div>
            </div>
          </div>
        </div>
        <div class="foot uk-flex uk-flex-space-between">
          <div class="left">
            <label><input type="checkbox" v-model="checkedAll"/>全选</label>
            <!-- <span class="del" @click="delChecked">删除选中商品</span> -->
            <span class="del" @click="showConfirmModal(1)">删除选中商品</span>
            <router-link to="/" tag="a" class="continue">继续购物</router-link>
          </div>
          <div class="right">
            <span class="select">已选商品<span>{{selectedGoodsQuantity}}</span>件</span>
            <span>合计：</span>
            <span class="num">{{totalPrice}}</span>
            <a class="total checkout" :class="{disable: disableCheck}" @click="checkout">去结算</a>
          </div>
        </div>
      </div>
      <div class="empty_cart" v-else >
        <div class="cart"><img src="../../assets/img/cart_empty.png"/></div>
        <div class="cart_reminder">购物车空空的哦~  去看看心仪的商品吧~</div>
        <nuxt-link class="go_login" to="/account/entry/sign-in" v-show="!isLogin">登录</nuxt-link>
        <nuxt-link class="go_shop" to="/">去购物 >></nuxt-link>
      </div>
      <recommend-goods :pageTypeKey="16" :positionKey="14" class="recommend_goods"></recommend-goods>
    </div>
    <alert-modal ref="cartAlertModal" @comfirm="deleteGoodModel()">
      <div slot="modal-content">确定删除商品吗？</div>
    </alert-modal>
  </div>
</template>


<script>
  import moment from 'moment'
  import Pay from '~components/biz/pay'
  import ChangeNum from '~components/biz/cart/change-num'
  import { mapGetters, mapActions } from 'vuex'
  import RecommendGoods from '~components/recommend-goods'
  import AlertModal from '~components/alert-modal'

  export default {
    data () {
      return {
        stepinfo: [{ name: '我的购物车', class: 'active' }, { name: '填写核对订单信息' }, { name: '成功提交订单' }],
        checkedAll: false,
        checkedIds: [],
        selectedCartSize: 0,
        totalPrice: '0.00',
        isLogin: false,
        flag: false,
        type: null,
        currentId: 0,
        selectedGoodsQuantity: 0
      }
    },
    watch: {
      cartSize () {
        this.manageMenu()
      },
      checkedIds: {
        handler () {
          this.selectedCartSize = this.checkedIds.length
          this.updateTotalPrice()
          this.updateSelectedQuantity()
          if (this.selectedCartSize === this.customCartList.length) {
            this.$set(this, 'checkedAll', true)
          } else {
            if (this.checkedIds.length === 0 || this.notCheckedAll) {
              this.$set(this, 'checkedAll', false)
            }
          }
        },
        deep: true
      },
      checkedQuantity: {
        handler () {
          this.updateTotalPrice()
          this.updateSelectedQuantity()
        }
      },
      checkedAll: {
        handler () {
          if (this.checkedAll) {
            this.$set(this, 'checkedIds', this.customCartList.map(item => item.goodsId))
          } else {
            if (!this.notCheckedAll) {
              this.$set(this, 'checkedIds', [])
            }
          }
        }
      }
    },
    methods: {
      ...mapActions({ fetchLocalCart: 'cart/fetchLocalCart', getMergedCart: 'cart/getMergedCart', updateLocalCartItem: 'cart/updateLocalCartItem' }),
      deleteGoodModel () {
        if (this.type === 1) {
          this.delChecked()
        } else {
          this.deleteGood(this.currentId)
        }
      },
      manageMenu () {
        if (this.cartSize > 0) {
          this.$store.commit('common/setShowMainHeader', false)
        } else {
          this.$store.commit('common/setShowMainHeader', true)
          this.$store.commit('common/setHeaderCartShow', false)
        }
      },
      updateTotalPrice () {
        const totalPrice = this.customCartList.filter(item => this.checkedIds.indexOf(item.goodsId) > -1)
          .reduce((total, item) => (
            total + parseFloat(item.goodsTotalPrice)
          ), 0)
        this.$set(this, 'totalPrice', totalPrice.toFixed(2))
      },
      updateSelectedQuantity () {
        const selectedQunatity = this.customCartList.filter(item => this.checkedIds.indexOf(item.goodsId) > -1)
          .reduce((total, item) => (
            total + parseFloat(item.goodsQuantity)
          ), 0)
        this.$set(this, 'selectedGoodsQuantity', selectedQunatity)
      },
      initPageData () {
        if (!this.isLogin) {
          this.fetchLocalCart()
        } else {
          this.getMergedCart().then((res) => {
            if (res.msg) {
              this.$store.commit('common/setMessage', res.msg)
            }
            global.hasOwnProperty('localStorage') && localStorage.removeItem('gz-cart')
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || err)
          })
        }
      },
      deleteGood (goodsId) {
        if (!this.flag) {
          this.flag = true
          this.$store.dispatch('cart/clearCart', [goodsId]).then((res) => {
            this.flag = false
            this.$refs.cartAlertModal.close()
            this.$store.commit('common/setMessage', `删除成功`)
          }).catch((err) => {
            this.flag = false
            this.$refs.cartAlertModal.close()
            this.$store.commit('common/setMessage', err.msg || err)
          })
        } else {
          this.$store.commit('common/setMessage', '请勿频繁操作')
        }
      },
      addGoodsToFavorite (goodsId, oprator) {
        if (!this.flag) {
          this.flag = true
          this.$store.dispatch('account/addGoodsToFavorite', goodsId).then((res) => {
            this.flag = false
            const index = this.$store.state.cart.cart.findIndex(item => item.goodsId === goodsId)
            this.$store.commit('common/setMessage', '成功移入收藏夹')
            this.$store.state.cart.cart.splice(index, 1)
            this.$store.dispatch('cart/clearCart', [goodsId])
            this.$set(this.$store.state.cart, 'cart', this.$store.state.cart.cart)
          }).catch((err) => {
            this.flag = false
            this.$store.commit('common/setMessage', err.msg || err)
          })
        } else {
          this.$store.commit('common/setMessage', '请勿频繁操作')
        }
      },
      addQuantity (obj) {
        this.$store.dispatch('cart/addGoodsQuantity', { goodsId: obj.goodsId, goodsQuantity: 1 })
          .then((res) => {
          })
          .catch((err) => {
            this.$store.commit('common/setMessage', err.msg || err)
          })
      },
      reduceQuantity: function (obj) {
        this.$store.dispatch('cart/reduceGoodsQuantity', { goodsId: obj.goodsId, quantity: 1 })
        .then(() => {
        })
        .catch((err) => {
          this.$store.commit('common/setMessage', err.msg || err)
        })
      },
      delChecked () {
        this.$store.dispatch('cart/clearCart', this.checkedIds)
        .then((res) => {
          this.$refs.cartAlertModal.close()
          this.$store.commit('common/setMessage', '删除成功！')
        })
        .catch((err) => {
          this.$refs.cartAlertModal.close()
          this.$store.commit('common/setMessage', err.msg || err)
        })
      },
      getCheckoutGoods () {
        let checkData = []
        this.customCartList.filter(item => this.checkedIds.indexOf(item.goodsId) > -1)
        .map(item => (checkData.push({
          goodsId: item.goodsId,
          goodsQuantity: item.goodsQuantity,
          IsActivity: item.tag === 1,
          itemType: item.itemType
        })))
        return checkData
      },
      checkout () {
        this.getCheckoutGoods()
        this.$store.dispatch('order/beforeCreate', {
          goods: this.getCheckoutGoods(),
          platformType: 1
        })
        .then((res) => {
          if (res) {
            this.$store.commit('order/setGoodsCache', {
              key: res,
              goods: {
                goods: this.getCheckoutGoods(),
                platformType: 1
              }
            })
            this.$store.commit('order/setGoodsIdCache', res)
            this.$router.push(`/order/create?key=${res}`)
          }
        })
        .catch((err) => {
          this.$store.commit('common/setMessage', err.msg)
        })
      },
      presaleTime (timeObj) {
        return moment(timeObj).format('MM月D日')
      },
      getGoodsTotalPrice (quantity, price) {
        return parseFloat(quantity * price).toFixed(2)
      },
      showConfirmModal (type, id) {
        this.$set(this, 'type', type)
        if (this.type === 1) {
          if (this.checkedIds && this.checkedIds.length > 0) {
            this.$refs.cartAlertModal.showModal()
          } else {
            this.$store.commit('common/setMessage', '请先选择需要删除的商品！')
          }
        } else {
          this.$set(this, 'currentId', id)
          this.$refs.cartAlertModal.showModal()
        }
      }
    },
    computed: {
      ...mapGetters({cartSize: 'cart/cartSize'}),
      notCheckedAll () {
        if (this.checkedIds.length > 0 && this.checkedIds.length < this.customCartList.length) {
          return true
        }
        return false
      },
      customCartList () {
        if (this.isLogin) {
          return this.$store.state.cart.cart.filter(item => item.goodsStatus === 2 && item.goodsLimit > 0)
                .map(item => Object.assign({}, item, {checked: false, goodsTotalPrice: this.getGoodsTotalPrice(item.goodsQuantity, item.computedPrice)}))
        } else {
          return this.$store.state.cart.cart.map(item => Object.assign({}, item, {checked: false, goodsTotalPrice: this.getGoodsTotalPrice(item.goodsQuantity, item.computedPrice)}))
        }
      },
      invalidCartList () {
        if (this.isLogin) {
          return this.$store.state.cart.cart.filter(item => item.goodsStatus !== 2 || item.goodsLimit < 1)
                 .map(item => Object.assign({}, item, {checked: false, goodsTotalPrice: this.getGoodsTotalPrice(item.goodsQuantity, item.computedPrice)}))
        }
        return []
      },
      checkedQuantity () {
        return this.customCartList.map(item => item.goodsQuantity)
      },
      disableCheck () {
        if (this.checkedIds.length > 0) return false
        return true
      }
    },
    components: {
      [ChangeNum.name]: ChangeNum,
      [Pay.PayHeader.name]: Pay.PayHeader,
      [RecommendGoods.name]: RecommendGoods,
      AlertModal
    },
    mounted () {
      if (!process.SERVER_BUILD) {
        this.isLogin = localStorage.getItem('sessionId') && localStorage.getItem('sessionId') !== 'undefined'
      }
      this.$store.commit('common/setShowNavigation', false)
      this.$store.commit('common/setBreadCrumbVisibility', false)
      this.initPageData()
      this.manageMenu()
    }
  }
</script>

<style lang="less">
  #cart{
    a {
      color: #333333;
      text-decoration: none;
      &:hover {
        color: #ff4544;
      }
    }
    input[type="checkbox"]{vertical-align: 2px;margin-right: 18px;margin-left: 20px;cursor: pointer;}
    .heading{
      background: #f4f4f4;height: 42px;font-size: 14px;color: #999999;
      .allCheck{width:60px;cursor: pointer;}
      .checkAll{width: 100px;}
      .goodsName{width: 33%;}
      .goodsNum{width: 20%;}
      .operate{width: 15%;}
    }
    .goodlist{
      font-size: 14px;color: #333333;
      .divisionLine{
        border-bottom: 1px solid #f4f4f4;
        padding-bottom: 25px;
      }
      .goodsImage{
        width: 100px;
        img{width: 76px;height: 76px;}
      }
      .allCheck{width:60px;}
      .goodsName{
        width: 33%;
        font-size: 14px;
        color: #333333;
        padding-right: 60px;
        .presale {
          width: 100%;
          margin-top: 17px;
          color: #ff4544;
          font-size: 14px;
          .gz-icon {
            background: #ff4544;
            border-radius: 16px;
            color: #fff;
            margin-right: 16px;
            margin-left: 12px;
          }
          padding-top: 4px;
          padding-bottom: 5px;
          background: rgba(255, 69, 68, 0.1)
        }
        p{width: 90%}
      }
      .goodsNum{width: 20%;}
      .goodsSum{font-size: 14px;font-weight: 600;color: #ff4544;font-family: Hiragino Sans GB, Microsoft Yahei;}
      .operate{width: 15%;font-size: 14px;color: #333333;cursor: pointer;}
      .invalid-tag{width: 40px;height: 20px;background-color: #dddddd; margin-right: 20px;margin-left: 10px;color:#999;font-size: 12px;text-align: center;}
      .invalid{
        background-color: #f4f4f4;color: #ccc;
        .title{font-size: 14px;color: #ccc;}
        .subtotal{color: #ccc;}
      }

    }
    .invalid,.valid{margin-top: 25px;}
    .invalid{
      padding-top:15px;padding-bottom:15px;
      .goodsName,.goodsSum{color:#ccc;}
    }
    .foot{
      background: #f4f4f4;height: 50px;color:#333;line-height: 50px;font-size: 14px;padding-left:10px;margin-top: 25px;margin-bottom: 165px;
      .left{
        input[type="checkbox"]{margin-left: 10px;margin-right: 25px;}
        .continue{color:#ff4544;cursor: pointer;}
        .del{margin-left: 30px;margin-right: 30px;cursor: pointer}
      }
      .right{
        .select{
          color:#999;margin-right: 30px;
          span{margin-left: 5px;margin-right: 5px;}
        }
        .num{color: #ff4544;font-size: 22px;font-weight: 600;}
        .total{cursor:pointer;display:inline-block;height: 50px;line-height: 50px;text-align: center;color:#fff;font-size: 18px;background:#ff4544;width: 162px;margin-left: 30px;}
        .checkout.disable {
          color: #999;
          background-color: #eee;
          pointer-events: none;
        }
      }
    }
    .empty_cart{
      text-align: center;
      font-size: 14px;
      color: #666666;
      padding-top: 60px;
      padding-bottom: 150px;
        .cart_reminder{
          margin-top: 36px;
          margin-bottom: 17px;
        }
        .go_shop, .go_login{
          font-size: 16px;
          font-weight: 300;
          color: #ff4544;
          cursor: pointer;
          width: 75px;
          margin-right: auto;
          margin-left: auto;
          /*border-bottom: 1px solid #ff4544;*/
        }
        .go_login {
          margin-right: 48px;
        }
    }
    .recommend_goods{
      margin-bottom: 97px;
    }
  }
</style>
