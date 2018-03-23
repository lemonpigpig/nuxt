<template lang="html">
  <div class="page-header">
    <div class="page-header-tophead" v-if="showTopHeader">
      <div class="page-header-tophead-content">
        <span>欢迎您来到国资商城！   <a href="http://www.gznb.com" target="_blank">返回官网首页</a></span>
        <span>
          <span class="accountName loginArea" v-show="iShowUser" @click="goAccount">
              {{ userName }}
          </span>
          <span class="logout loginArea" v-show="iShowUser" @click="signOut">
              退出登录
          </span>
          <span class="loginArea" v-show="!iShowUser">
              <nuxt-link :to="{ name: 'account-entry-sign-in' }">登录</nuxt-link>   <nuxt-link :to="{ name: 'account-entry-sign-up' }" class="sign-up">免费注册</nuxt-link>
          </span>
          <span class="my-area">
              丨<a class="my-order-button" @click="goMyOrder">我的订单</a>丨<nuxt-link :to="{ name: 'help-center-id', params: {id: 'index'} }" target="_blank" class="my-order-button">帮助中心</nuxt-link>丨         <nuxt-link :to="{ name: 'news-list'}" class="news"><img src="~assets/img/news.svg" style="margin-right:5px;vertical-align:text-bottom;"/>新闻公告</nuxt-link><span class="download-app"><img src="~assets/img/mobile.svg"  style="margin-right:1px;vertical-align:text-bottom;"/> <div class="qcrode">  </div>    下载APP</span>
          </span>
        </span>

      </div>
    </div>
    <div class="page-header-search"  v-if="showMainHeader">
      <nuxt-link :to="{ name: 'home'}">
        <gz-icon className="gznb-logo" icon="logo" size="130 54"></gz-icon>
      </nuxt-link>
      <div class="categoryAll" v-if="showMainHeaderCategory">
        {{$store.state.common.currentCategory}}
        <div class="categorys">
          <ul>
            <li v-for="(item, index) in $store.state.common.category">
            <nuxt-link :to="`/category/first?code=${item.code}`">{{item.name}}</nuxt-link>
            <span v-if="index%2 === 0">、</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="search-and-cart">
        <div class="search-content">
          <div class="search-bar">
            <input type="text" name="" v-model="keywords" @keyup.13="search" :placeholder="defaultKeyWords" :class="{'light': isLight}">
            <button type="button" class="btn btn-red" name="button" @click="search">
                <gz-icon icon="search" size="16"/>
                搜索
            </button>
          </div>
          <div class="keywords">
            <span v-for="item in kewards"  @click="goCategory(item)">{{item.keyWord}}</span>
          </div>
        </div>
        <div class="buy-cart"  v-show="showHeaderCart">
          <div class="buy-cart-cart" @click="goCart"  >
            <span class="icon-cart">
              <gz-icon icon="cart" size="16"/>
            </span>
            <span class="cart-word">购物车</span>
            <span class="cart-number" v-text="cartSize"></span>
          </div>
          <div class="cart-detail-item">
            <div class="cart-wraper">
              <div class="cart-icon-header">
                <span class="lastest-add">最新加入的商品</span>
              </div>
              <div class="cart-icon-content" @mouseenter="mouseenter()" @mouseleave="mouseleave()">
                <ul class="cart-goods-list">
                    <li class="goods-list-item" v-for="item in cartList" @click="goGoodsDetail(item)">
                      <div class="" style="display:flex">
                        <img :src="item.goodsImage" alt="">
                        <span class="goods-title" v-text="item.goodsName"></span>
                      </div>

                      <div class="goods-price">
                        <span class="price">¥{{item.computedPrice}}</span>
                        <span class="quantity">x{{item.goodsQuantity}}</span>
                        <div class="delete" @click="deleteGoodsById(item, $event)">删除</div>
                      </div>
                    </li>
                </ul>
              </div>
              <div class="cart-icon-footer">
                <span class="footer-sumary">共<strong>{{cartSize}}</strong>件商品  共计¥ <strong>{{totalPrice}}</strong></span>
                <button class="btn btn-red" @click="goCart">去购物车</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      cartSize: 'cart/cartSize',
      totalPrice: 'cart/totalPrice',
      cartList: 'cart/getCartList',
      showHeaderCart: 'common/showHeaderCart',
      showMainHeaderCategory: 'common/showMainHeaderCategory'
    }),
    showMainHeader () {
      return this.$store.state.common.showMainHeader
    },
    cartInfo () {
      return this.$store.state.cart.cartInfo || {}
    },
    iShowUser () {
      return !!this.$store.state.authorization.sessionId || false
    },
    userName () {
      if (this.$store.state.authorization.userName && this.$store.state.authorization.userName !== 'undefined') {
        return this.$store.state.authorization.userName
      } else if (!process.SERVER_BUILD) {
        return localStorage.getItem('userName')
      }
      return ''
    },
    showTopHeader () {
      return this.$store.state.common.showTopHeader
    },
    sessionId () {
      return this.$store.state.authorization.sessionId || ''
    }
  },
  data () {
    return {
      kewards: [],
      keywords: '',
      isLight: false,
      defaultKeyWords: '',
      showCartDetail: false,
      cartDetailFlag: false,
      showLength: 4,
      iShowLogout: false,
      queryCondition: {
        'PageTypeKey': 1,
        'DisplayCategoryCode': '',
        'FeatureMuseumId': 0
      }
    }
  },
  watch: {
    '$route': 'routeChange',
    queryCondition: {
      deep: true,
      handler (val) {
        this.fetchKeywords()
      }
    },
    userName: {
      handler () {
      }
    },
    keywords (val) {
      if (val.trim() === '') {
        this.isLight = false
      }
    }
  },
  methods: {
    mouseenter () {
      // document.querySelector('body').style = 'overflow:hidden'
    },
    mouseleave () {
      // document.querySelector('body').style = 'overflow:auto'
    },
    deleteGoodsById ({ goodsId }, event) {
      event.stopPropagation()
      this.$store.dispatch('cart/clearCart', [goodsId]).then((res) => {
        this.$store.commit('common/setMessage', '删除成功！')
      }).catch((err) => {
        this.$store.commit('common/setMessage', err || err.msg)
      })
    },
    goGoodsDetail ({ goodsId }) {
      this.$router.push(`/goods/${goodsId}`)
    },
    signOut () {
      this.$store.dispatch('authorization/signOut').then(() => {
        this.$set(this, 'iShowLogout', false)
        this.$store.commit('cart/updateCart', [])
        this.$store.commit('cart/updatePromotion', [])
        this.$store.commit('account/setFavoritesList', [])
        this.$router.push('/account/entry/sign-in')
      }).catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    },
    goCategory (item) {
      this.$router.push(`/category?k=${item.keyWord}`)
    },
    goCart () {
      this.$router.push('/cart')
    },
    goMyOrder () {
      this.$router.push('/account/center?type=1&source=order-search')
    },
    search () {
      this.isLight = true
      this.$store.dispatch('keywords/isSensitive', { KeyWords: this.keywords }).then((data) => {
        if (data) {
          this.$store.commit('common/setMessage', '您搜索的内容包含敏感词汇！')
        } else {
          this.$router.push(`/category?k=${this.keywords === '' ? this.defaultKeyWords : this.keywords}&${(new Date()).getTime()}`)
        }
      })
    },
    clearSearch () {
      this.keywords = ''
    },
    setQueryCondition (url) {
      switch (url) {
        case 'home': this.queryCondition = { PageTypeKey: 1, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'index': this.queryCondition = { PageTypeKey: 1, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'category-first':
          this.$store.commit('common/setFirstCategory', { code: this.$route.query.code, hoverCode: '' })
          this.queryCondition = { PageTypeKey: 2, DisplayCategoryCode: this.$route.query.code, FeatureMuseumId: 0 }
          break
        case 'category-id': this.queryCondition = { PageTypeKey: this.$route.params.id ? 2 : this.queryCondition.PageTypeKey, DisplayCategoryCode: this.$route.params.id ? this.$route.params.id.slice(0, 4) : '', FeatureMuseumId: 0 }
          break
        case 'museums': this.queryCondition = { PageTypeKey: 23, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'museums-id': this.queryCondition = { PageTypeKey: 3, DisplayCategoryCode: '', FeatureMuseumId: this.$route.params.id }
          break
        case 'origin': this.queryCondition = { PageTypeKey: 4, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'flashsale': this.queryCondition = { PageTypeKey: 5, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'goods-id': this.queryCondition = { PageTypeKey: 20, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'help-center-id': this.queryCondition = { PageTypeKey: 22, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'news-list': this.queryCondition = { PageTypeKey: 24, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'order': this.queryCondition = { PageTypeKey: 18, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'cart': this.queryCondition = { PageTypeKey: 16, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'account-center': this.queryCondition = { PageTypeKey: 18, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'account-entry-sign-in': this.queryCondition = { PageTypeKey: 30, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'account-entry-sign-up': this.queryCondition = { PageTypeKey: 32, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'account-entry-findPwd-step1': this.queryCondition = { PageTypeKey: 34, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'account-entry-findPwd-step2': this.queryCondition = { PageTypeKey: 34, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'account-entry-findPwd-step3': this.queryCondition = { PageTypeKey: 34, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        case 'account-entry-findPwd-Success': this.queryCondition = { PageTypeKey: 34, DisplayCategoryCode: '', FeatureMuseumId: 0 }
          break
        default: this.queryCondition = { PageTypeKey: 26, DisplayCategoryCode: '', FeatureMuseumId: 0 }
        // this.queryCondition = { PageTypeKey: 7, DisplayCategoryCode: '', FeatureMuseumId: 0 }
      }
    },
    routeChange () {
      this.setQueryCondition(this.$route.name)
      if (this.$route.path !== '/category') {
        this.clearSearch()
        this.isLight = false
      } else {
        this.isLight = true
        if (this.$route.query.k) {
          this.keywords = this.$route.query.k
        }
      }

      if (this.$route.name === 'index' || this.$route.name === 'home' || this.$route.name === 'category-first') {
        // first, index, home show category
        this.$store.commit('common/setShowCategory', true)
      } else {
        this.$store.commit('common/setShowCategory', false)
      }
    },
    goAccount () {
      this.$router.push('/account/center')
    },
    fetchKeywords () {
      this.$store.dispatch('common/getHotKewardsByPosition', this.queryCondition).then((data) => {
        if (data && data.length) {
          this.$set(this, 'kewards', data.map(item => Object.assign({}, item)))
        }
      })
      this.$store.dispatch('common/getDefaultKeywords', this.queryCondition).then((data) => {
        if (data.length) {
          this.$set(this, 'defaultKeyWords', data[0].keyWord)
        } else {
          this.$set(this, 'defaultKeyWords', '')
        }
      })
    }
  },
  mounted () {
    if (this.$route.path !== '/order/create') {
      const temp = JSON.parse(localStorage.getItem('goodsIdCache'))
      if (temp && temp.length && temp !== 'null') {
        temp.forEach((item) => {
          if (localStorage.getItem(item)) {
            this.$store.commit('order/removeGoodsCache', item)
          }
        })
      }
      localStorage.setItem('goodsIdCache', JSON.stringify([]))
    }
    this.setQueryCondition(this.$route.name)
    // this.fetchKeywords()
    if (this.$route.query.k) {
      this.keywords = this.$route.query.k
    }
    if (this.$route.path === '/category') {
      this.isLight = true
    }
  },
  components: {
  }
}
</script>

<style lang="less">

.page-header{
  .download-app{
    color: #333;
    cursor: pointer;
  }
  .light{
    color: #999999;
  }
  .download-app:hover .qcrode{
    display: block ;
    z-index: 10;
  }
  .qcrode{
    position: absolute;
    width: 100px;
    height: 116px;
    background: url('~static/img/app.png');
    background-position: center;
    background-size: contain;
    top: 26px;
    right: -16px;
    display: none;
    background-repeat: no-repeat;
  }
  .categoryAll {
    a {
      color: #333333;
      text-decoration: none;
      &:hover {
        color: #ff4544;
      }
    }
    width: 80px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #666;
    font-size: 12px;
    margin-left: 51px;
    position: relative;
    border: 1px solid #ddd;
    &:after {
      content: '';
      width: 5px;
      height: 5px;
      border-left: 1px solid #999;
      border-top: 1px solid #999;
      display: inline-block;
      transform: rotate(135deg);
      position: relative;
      top: -2px;
    }
    &:hover:after {
      top: -3px;
      transform: rotate(-135deg);
      border-color: #ff4544;
      left: 3px;
    }
    .categorys {
      position: absolute;
      width: 140px;
      height: auto;
      top: 23px;
      left: -1px;
      border: 1px solid #ddd;
      display: none;
      padding: 6px 11px 14px 11px;
      background: #fff;
      color: #666;
      z-index: 999;
      ul {
        width: 100%;
        text-align: left;
        font-size: 12px;
        text-align: left;
        color: #666;
        li {
          display: inline;
        }
      }
    }
    &:hover {
      border-bottom: none;
      color: #ff4544;
    }
    &:hover .categorys {
      display: block;
    }
  }
  width: 100%;
  .show{
    display: block !important;
  }
  .btn{
    width: 90px;
    height: 100%;
    color: white;
    outline: none;
    box-sizing: border-box;
    border: none;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    color: #ffffff;
    .gz-icon{
      margin: 0 10px;
    }
  }
  .btn-red{
    background-color: #ff4544;
  }
  &-tophead{
    background: #f4f4f4;
    font-size: 12px;
    color: #666666;
    height: 35px;
    width: 100%;
    &-content{
      position: relative;
      width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      line-height: 35px;
      justify-content: space-between;
      padding-left: 18px;
      span {
          a{
            text-decoration: none;
            color: #ff4544;
            cursor: pointer;
          }
      }

      .loginArea {
          // margin-left: 600px;
          padding-left: 4px;
          .sign-up{
            margin-left: 12px;
            margin-right: 23px;
          }
      }

      .accountName {
        cursor: pointer;
        position: relative;
        margin-right: 14px;
        color: #ff4544;
        text-decoration: underline;
      }
      .logout {
        cursor: pointer;
      }
      .accountName:hover{
          background: #fff;
      }
      .logout-enter-active {
        transition: all .3s ease;
      }
      .logout-leave-active {
        transition: all .8s;
      }
      .logout-enter, .logout-leave-to
      {
        opacity: 0;
      }
      .my-order-button{
        color: #666;
      }
      .my-order-button:hover{
        color: #ff4544;
      }
      .news{
        color: #333;
        margin-left: 20px;
        margin-right: 18px;
      }
      .news:hover{
        color: #ff4544;
      }
    }
  }
  &-search{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    height: 134px;
    align-items: center;
    .gznb-logo{

    }
    .search-and-cart{
      display: flex;
    }
    .search-content{
      margin-left: 65px;
      width: 581px;
      .keywords{
        font-size: 14px;
        color: #999999;
        margin-top: 11px;
        margin-left: 15px;
        cursor: pointer;
        max-height: 17px;
        overflow: hidden;
        span{
          margin-left: 10px;
        }
        span:hover{
          color: #ff4544;
        }
      }
      .search-bar{
        width: 581px;
        border: 2px solid  #ff4544;
        box-sizing: border-box;
        height: 36px;
        display: flex;
        input{
          width: 491px;
          height: 100%;
          padding-left: 13px;
          box-sizing: border-box;

        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #999999;
          font-size: 14px;
        }

        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #999999;
          font-size: 14px;
        }

        input:-ms-input-placeholder{
          color: #999999;
          font-size: 14px;
        }

        input::-webkit-input-placeholder{
          color: #999999;
          font-size: 14px;
        }

      }
    }
  }
  .cart-detail-item:hover, .cart-detail-item{
    display: block;
  }
  .cart-detail-item{
    width: 296px;
    display: none;
    cursor: default;
    box-sizing: border-box;
    position: absolute;
    z-index: 999;
    border: 1px solid #ff4544;
    background: white;
    .cart-wraper {
      position: relative;
      z-index: 2;
      width: 100%;
    }
    .cart-icon-header{
      margin-top: 8px;
      margin-left: 10px;
      .lastest-add{
        font-size: 12px;
        font-weight: 600;
        color: #666666;
      }
    }
    .cart-icon-content{
      margin-left: 10px;
      width: auto;
      max-height: 290px;
      overflow-y: auto;
      .cart-goods-list{
        .goods-list-item{
          height: 50px;
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          img{
            width: 50px;
            height: 50px;
          }
          .goods-title{
            font-size: 12px;
            text-align: left;
            color: #666666;
            display: inline-block;
            width: 104px;
            margin-left: 15px;
            overflow: hidden;
          }
          .goods-price{
            float: right;
            font-size: 14px;
            margin-right: 10px;
            font-weight: 600;
            .price{
              color: #ff4544;
              font-family: Hiragino Sans GB, Microsoft Yahei;
            }
            .quantity{
              color: #666666;
            }
            .delete{
              font-size: 12px;
              text-align: right;
              color: #666666;
              cursor: pointer;
            }
          }
        }
      }
    }
    .cart-icon-footer{
      height: 50px;
      margin-top: 15px;
      background: #f8f8f8;
      .footer-sumary{
        margin-left: 10px;
        font-size: 14px;
        color: #666666;
        line-height: 50px;
        font-family: Hiragino Sans GB, Microsoft Yahei;
      }
      .btn-red{
        width: 80px;
        float: right;
        justify-content: center;
        text-align: center;
      }
    }
  }
  .buy-cart:hover .cart-detail-item{
    display: block;
  }
  .buy-cart{
    cursor: pointer;
    margin-left: 44px;
    position: relative;
    // width: 124px;
    // height: 34px;
    .icon-cart{
      display: inline-block;
      width: 33px;
      height: 100%;
      background: #ff4544;
      color: white;
      display: flex;
      transform:scaleX(-1);
      justify-content: center;
      align-items: center;
    }
    &:hover .icon-cart {
      background: #ca2a29;
    }
    .buy-cart-cart{
      height: 34px;
      width: 124px;
      box-sizing: border-box;
      border: solid 1px #ff4544;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      .cart-word{
        font-size: 12px;
        color: #ff4544;
        margin-left: 16px;
      }
      .cart-number{
        color: white;
        background: #ff4544;
        transform: scale(.9);
        border-radius: 10px;
        font-size: 12px;
        line-height: 11px;
        margin-left: 5px;
        font-weight: 300;
        min-width: 12px;
        text-align: center;
        padding: 2px 1px 2px 1px;
      }
    }
    &:hover .buy-cart-cart {
      border-color: #ca2a29;
      .cart-word {
        color: #ca2a29;
      }
      .cart-number {
        background: #ca2a29;
      }
    }
  }
}
</style>
