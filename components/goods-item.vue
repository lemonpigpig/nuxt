<template lang="html">
    <div class="goods-item-cell" :style="{width: width, height: height}">
      <div class="goods-src" v-if="itemObj.isTraceSource">溯源</div>
      <div class="goods-remove" @click="showDeleteModal(itemObj.id)" v-if="showRemove"><gz-icon size="16" icon="remove"></gz-icon></div>
      <div class="goods-background" :style="{width: width, height: height}" v-if="itemObj.stock<=0 && itemObj.status===2" @click="goGoodsDetail">已售罄</div>
      <div class="goods-background" :style="{width: width, height: height}" v-if="itemObj.status===3" @click="goGoodsDetail">已下架</div>
      <div class="cart-button" :style="{width: width, marginTop: topPx}" v-if="itemObj.stock>0 && itemObj.status===2">
        <span class="cart" @click="placeCart(itemObj)">
          <gz-icon icon="cart" size="16"></gz-icon> 加入购物车
        </span>
        <span class="collection" v-if="showCollection" >
          <template v-if="isFavorite(itemObj)">
            <span @click="cancelCollect(itemObj)">
              <gz-icon size="16" icon="heart1"></gz-icon>收藏
            </span>
          </template>
          <template v-else-if="!isFavorite(itemObj)">
            <span @click="collect(itemObj)">
              <gz-icon size="16" icon="heart"></gz-icon> 收藏
            </span>
          </template>
        </span>
      </div>
      <div class="cart-button" :style="{width: width, marginTop: topPx}" v-if="itemObj.stock>0 && itemObj.status===5">
        <span class="cart">
          敬请期待
        </span>
      </div>
      <div class="goods-item-content">
        <div :style="{width: width, height: width}" @click="goGoodsDetail">
          <div class="goods-item-image" :style="{'background-image': `url(${item.imageCover})`}">
          </div>
        </div>
        <div class="goods-item-detail">
          <span class="goods-tags" v-if="tags && tags.length>0">
            <span class="tag" :class="{red: tag.name==='reduce' || tag.name==='coupon', darkgrey: tag.name==='self', coffee: tag.name==='buy'}"
                  v-for="tag in tags">
                  {{tag.desc}}
            </span>
          </span>
          <span class="title" :style="{fontSize: titleSize, color: titleColor}">{{itemObj.goodsName || itemObj.name}}</span>
          <span class="introduction" :style="{fontSize: introductionSize, color: introductionColor}" v-if="showDesc">{{itemObj.introduction}}</span>
          <span class="price" :style="{fontWeight: priceFontWeight}">
            <img src="~assets/img/money.svg" />{{itemObj.computedPrice}}
          </span>
        </div>
      </div>
      <alert-modal ref="alertModal" @comfirm="comfirm">
        <div slot="modal-content">确认取消收藏该商品吗?</div>
      </alert-modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AlertModal from '~components/alert-modal'
import Tag from '~components/biz/tag/tag'

export default {
  name: 'goods-item',
  props: {
    showDesc: {
      type: Boolean,
      default: () => true
    },
    width: {
      type: String,
      default: () => '200px'
    },
    height: {
      type: String,
      default: () => '260px'
    },
    item: {
      type: Object,
      default: () => {}
    },
    showCollection: {
      type: Boolean,
      default: () => false
    },
    titleSize: {
      type: String,
      default: () => '14px'
    },
    titleColor: {
      type: String,
      default: () => '#4a4a4a'
    },
    introductionSize: {
      type: String,
      default: () => '12px'
    },
    introductionColor: {
      type: String,
      default: () => '#999'
    },
    priceFontWeight: {
      type: String,
      default: () => '600'
    },
    showRemove: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      deleteCollectId: ''
    }
  },
  methods: {
    ...mapActions({ updateFavoriteGoodsItemList: 'account/updateFavoriteGoodsItemList', deleleSingleFavoriteGoods: 'account/deleleSingleFavoriteGoods' }),
    goGoodsDetail () {
      var id = this.itemObj.goodsId || this.itemObj.id
      window.open(`/goods/${id}`)
    },
    placeCart (goods) {
      const params = {
        goodsId: goods.goodsId || goods.id,
        goodsQuantity: 1,
        isSelected: true,
        itemType: goods.itemType || 1
      }
      this.$store.dispatch('cart/addGoodsQuantity', Object.assign({}, goods, params))
      .then((res) => {
        this.$store.commit('common/setMessage', '添加成功')
      })
      .catch((err) => {
        this.$store.commit('common/setMessage', err || err.msg)
      })
    },
    collect (goods) {
      this.$store.dispatch('account/addGoodsToFavorite', goods.goodsId || goods.id)
      .then((res) => {
        this.$store.commit('common/setMessage', '收藏成功')
      })
      .catch((err) => {
        this.$store.commit('common/setMessage', (err && err.msg) || err)
      })
    },
    cancelCollect (goods) {
      const id = goods.goodsId || goods.id
      this.deleleSingleFavoriteGoods([id])
      .then((res) => {
        this.$store.commit('common/setMessage', '取消成功！')
      })
      .catch((err) => {
        this.$store.commit('common/setMessage', err || err.msg)
      })
    },
    goodsRemove () {
      this.$emit('remove', this.itemObj)
    },
    isFavorite (itemObj) {
      const id = itemObj.goodsId || itemObj.id
      return this.favoritesGoodsItemList && this.favoritesGoodsItemList.indexOf(id) > -1
    },
    showDeleteModal (id) {
      this.$refs.alertModal.showModal()
      this.$set(this, 'deleteCollectId', id)
    },
    comfirm () {
      this.$emit('getDeleteId', this.deleteCollectId)
      this.$refs.alertModal.close()
    }
  },
  computed: {
    ...mapGetters({ favoritesGoodsItemList: 'account/favoritesGoodsItemList' }),
    itemObj () {
      return this.item
    },
    topPx () {
      const height = this.height.split('px')[0] - 52
      return height + 'px'
    },
    tags () {
      const tagList = []
      if (this.itemObj.isPresale && this.itemObj.status === 2) {
        tagList.push({ name: 'presale', desc: '预售' })
      }
      if (this.itemObj.hasCoupon) {
        tagList.push({ name: 'coupon', desc: '券' })
      }
      if (this.itemObj.hasGift && this.itemObj.hasReduce) {
        tagList.push({ name: 'gift-reduce', desc: '满减赠' })
      } else if (!this.itemObj.hasGift && this.itemObj.hasReduce) {
        tagList.push({ name: 'reduce', desc: '满减' })
      } else if (this.itemObj.hasGift && !this.itemObj.hasReduce) {
        tagList.push({ name: 'gift', desc: '满赠' })
      }
      if (this.itemObj.buyMore) {
        tagList.push({ name: 'buy', desc: '加购' })
      }
      if (this.itemObj.isAbholung) {
        tagList.push({ name: 'self', desc: '自提' })
      }
      return tagList
    }
  },
  components: {
    [AlertModal.name]: AlertModal,
    [Tag.name]: Tag
  },
  watch: {
    favoritesGoodsItemList: {
      handler () {
      }
    },
    isFavorite: {
      handler () {
      }
    }
  }
}
</script>

<style lang="less">
.goods-item-cell{
  box-sizing: border-box;
  border-right: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
  background-color: white;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  .goods-background {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
  	text-align: justify;
  	color: #ffffff;
    position: absolute;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .goods-src {
    position: absolute;
    padding: 0px 6px;
    height: 18px;
    line-height: 18px;
    background-color: rgba(227, 206, 171, 0.2);
    border: solid 1px #b7a078;
    font-size: 12px;
    font-weight: 500;
    color: #b7a078;
    margin: 14px 0 18px 14px;
    z-index: 5;
    right: 0px;
  }
  .goods-remove {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 100px;
    line-height: 30px;
    background-color: #bab5b0;
    font-size: 12px;
    font-weight: 500;
    color: white;
    margin: 14px 0 18px 185px;
    z-index: 10;
    display: none;
    .gz-icon {
      margin-left: 7px;
    }
  }
  .cart-button{
    position: absolute;
    display: flex;
    align-items: center;
    bottom: -52px;
    z-index: 1;
    -moz-transition-property:all;
    -moz-transition-duration:0.3s;
    /* Safari and Chrome */
    -webkit-transition-property:all;
    -webkit-transition-duration:0.3s;
    /* Opera */
    -o-transition-property:all;
    -o-transition-duration:0.3s;
    .gz-icon {
      margin-right: 4px;
    }
    span.cart{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      background-color: #ff4544;
      width: 60%;
      height: 52px;
      font-weight: 300;
      color: white;
      line-height: 52px;
      transition:  0.3s;
    }
    .collection {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40%;
      height: 52px;
      font-weight: 300;
      color: white;
      line-height: 52px;
      transition:  0.3s;
      background-color: #ff5f25 !important;
    }
  }
  .goods-item-content {
    position: relative;
    z-index: 0;
    .goods-item-image{
      width: 80%;
      height: 80%;
      margin: 0px auto;
      padding-top: 5%;
      box-sizing: content-box;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .goods-item-detail{
      padding: 0 10px;
      span{
        display: block;
        text-align: center;
        // letter-spacing: -0.8px;
      }
      .title{
        margin-top: 8px;
        // color: #4a4a4a;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .introduction {
        // font-size: 14px;
      	// color: #999999;
        line-height: 21px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .price{
        font-size: 16px;
        // font-weight: 600;
        color: #ff4544;
        margin: 4px 0px 8px;
        img {
          height: 12px;
          margin-right: 1px;
        }
      }
      .goods-tags {
        margin-top: -20px;
        font-size: 12px;
        margin-left: auto;
        margin-right: auto;
        .tag {
          display: inline-block;
          padding: 1px 4px;
          background-color: #fe8d00;
          color: white;
          margin-right: 5px;
        }
        .red {
          background-color: #ff4544;
        }
        .coffee {
          background-color: #e4cfac;
        }
        .darkgrey {
          background-color: #555c78;
        }
      }
    }
  }
  &:hover .cart-button {
    bottom: 0px;
  }
  &:hover .goods-remove {
    display: block;
  }
  .tag-items {
    margin-top: -25px;
    text-align: center;
  }
  .tag-items:empty {
    margin-top: 0;
  }
}
</style>
