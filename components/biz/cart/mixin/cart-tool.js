import moment from 'moment'

export default {
  name: 'gz-cart-tool',
  data () {
    return {
      flag: false,
      checkedGoodsIds: []
    }
  },
  methods: {
    presaleTime (timeObj) {
      return moment(timeObj).format('MM月D日')
    },
    deleteGoods (goodsId, handler) {
      console.log('deleteGoods:', goodsId)
      let goodsIdTemp = goodsId
      if (goodsIdTemp && typeof goodsIdTemp !== 'object') {
        goodsIdTemp = [goodsId]
      }
      if (!this.flag) {
        this.flag = true
        this.$store.dispatch('cart/clearCart', goodsIdTemp).then((res) => {
          this.flag = false
          if (handler && typeof handler === 'function') handler.call(this)
          this.$store.commit('common/setMessage', `删除成功`)
        }).catch((err) => {
          this.flag = false
          if (handler && typeof handler === 'function') handler.call(this)
          this.$store.commit('common/setMessage', err)
        })
      } else {
        this.$store.commit('common/setMessage', '请勿频繁操作')
      }
    },
    addGoodsToFavorite (id) {
      console.log('collectGoods:', id)
    },
    showConfirmModal (handler, id) {
      console.log('id:', id)
      if (id && handler && typeof handler === 'function') {
        handler.call(this, id)
      } else {
        console.log('checkedGoodsIds:', this.checkedGoodsIds)
        if (this.checkedIds && this.checkedIds.length > 0) {
          if (handler && typeof handler === 'function') handler.call(this)
        } else {
          this.$store.commit('common/setMessage', '请先选择需要删除的商品！')
        }
      }
    },
    selectGoods (goodsIds) {
      this.$store.dispatch('cart/selectGoods', goodsIds).then((res) => {
      })
      .catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    },
    cancelGoods (goodsIds, item) {
      this.$store.dispatch('cart/cancelGoods', goodsIds)
        .then((res) => {
          // if (item.promotionId) {
          //   const promotionInfo = item.promotionInfo[item.promotionId]
          //   if (promotionInfo.goodsLen === 1) {
          //     console.log('promotionInfo.goodsLen:', promotionInfo.goodsLen)
          //     this.$store.commit('cart/updateRuleCancel', {id: item.promotionId, lowestRuleId: promotionInfo.lowestRuleId})
          //   } else {
          //     console.log('updateViewModel promotionInfo.goodsLen:', promotionInfo.goodsLen)
          //     this.$store.dispatch('cart/updateViewModel', res)
          //   }
          // }
        })
        .catch((err) => {
          this.$store.commit('common/setMessage', err)
        })
    }
  },
  computed: {
    checkedAll: {
      get () {
        return this.$store.state.cart.checkedAll
      }
      // set (value) {
      //   console.log('value:', value)
      //   this.$store.commit('cart/updateCheckedAll', value)
      // }
    },
    checkedIds: {
      get () {
        return this.$store.state.cart.checkedIds
      }
      // set (value) {
      //   this.$store.commit('cart/updateCheckedIds', value)
      // }
    }
  },
  watch: {
  }
}
