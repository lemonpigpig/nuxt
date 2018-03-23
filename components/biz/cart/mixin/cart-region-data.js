export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    promotionList: {
      type: Array,
      default: () => []
    },
    goodsNotInPromotion: {
      type: Array,
      default: () => []
    },
    invalidCartList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selectableCartGoodsLen () {
      // return this.goodsNotInPromotion.length + this.promotionList.length
      // 暂时不考虑一个商品参与多个活动的情况
      const totalLen = this.promotionList.reduce((total, item) => {
        if (item && item.promotionItemList) {
          const canSelectedLen = item.promotionItemList.reduce((total, item) => {
            if (item.itemType !== 2) {
              return total + 1
            }
            return total
          }, 0)
          return total + canSelectedLen
        }
        return total
      }, this.goodsNotInPromotion.length)
      return totalLen
    },
    notCheckedAll () {
      if (this.checkedIds.length > 0 && this.checkedIds.length < this.selectableCartGoodsLen) {
        return true
      }
      return false
    }
  },
  methods: {

  },
  watch: {
    checkedAll: {
      handler (value) {
        if (value) {
          // 对于promotion促销活动而言目前不考虑多个活动的
          const ids = this.goodsNotInPromotion.map(item => item.goodsId)
          this.promotionList.forEach(item => (
            item.promotionItemList.forEach(goods => {
              if (goods.itemType !== 2) {
                ids.push(goods.goodsId)
              }
            })
          ))
          this.$store.commit('cart/updateCheckedIds', ids)
        } else {
          if (!this.notCheckedAll) {
            this.$store.commit('cart/updateCheckedIds', [])
          }
        }
      }
    },
    checkedIds: {
      handler () {
        if (this.checkedIds.length === this.selectableCartGoodsLen) {
          this.$store.commit('cart/updateCheckedAll', true)
        } else {
          if (this.checkedIds.length === 0 || this.notCheckedAll) {
            this.$store.commit('cart/updateCheckedAll', false)
          }
        }
      },
      deep: true
    }
  }
}
