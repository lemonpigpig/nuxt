<template>
  <div id="change-num">
    <div class="controller uk-flex uk-flex-space-between">
      <span class="reduce" @click="reduce" :class="{ no_activate: (isLogin && (goodsQuantity == minLimit || quantityInput <= minLimit)) || (!isLogin && goodsQuantity === 1)}">-</span>
      <input v-model="quantityInput" type="text" @keyup="updateCartGoodsQuantity()">
      <span class="add" @click="add" :class="{ no_activate: isLogin && (goodsQuantity == goodsLimit || quantityInput >= goodsLimit)}">+</span>
    </div>
    <div class="describe" v-if="isLogin && (goodsQuantity == goodsLimit || quantityInput >= goodsLimit)">限购{{goodsLimit}}件</div>
    <div class="describe" v-else-if="goodsQuantity == minLimit || quantityInput <= minLimit">{{minLimit}}件起购</div>
    <div class="describe" v-else></div>
  </div>
</template>

<script>

export default {
  name: 'change-number',
  props: {
    index: {
      type: Number,
      default: () => 0
    },
    goodsQuantity: {
      type: Number,
      default: () => 1
    },
    goodsLimit: {
      type: Number,
      default: () => 1
    },
    increment: {
      type: Number,
      default: () => 1
    },
    minLimit: {
      type: Number,
      default: () => 1
    },
    goodsId: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isLogin: false,
      quantityInput: '',
      localMaxSize: 999,
      flag: false
    }
  },
  methods: {
    updateCartGoodsQuantity () {
      if (this.quantityInput < 1) {
        this.quantityInput = 1
      } else {
        if (this.quantityInput > 999) {
          this.quantityInput = 999
        }
      }
      const params = {
        goodsId: this.goodsId,
        goodsQuantity: this.quantityInput,
        isSelected: true,
        itemType: this.item.itemType || 1
      }
      this.$store.dispatch('cart/updateGoodsQuantity', params)
    },
    add () {
      if (!this.flag && !this.isOutOfLimit(1)) {
        const goodsQuantity = this.item.goodsQuantity + 1
        this.quantityInput = goodsQuantity
        // this.$emit('add', Object.assign({}, this.item, {goodsQuantity: goodsQuantity}))
        this.addQuantity(Object.assign({}, this.item, {goodsQuantity: goodsQuantity}))
      }
    },
    reduce () {
      if (!this.flag && !this.isOutOfLimit(2)) {
        const goodsQuantity = this.item.goodsQuantity - 1 ? this.item.goodsQuantity - 1 : 1
        this.quantityInput = goodsQuantity
        this.reduceQuantity(Object.assign({}, this.item, {goodsQuantity: goodsQuantity}))
        // this.$emit('reduce', Object.assign({}, this.item, {goodsQuantity: goodsQuantity}))
      }
    },
    isOutOfLimit (oprator) {
      let goodsQuantity = this.goodsQuantity
      if (oprator === 1) {
        goodsQuantity = goodsQuantity + 1
        const goodsLimit = this.isLogin ? this.goodsLimit : this.localMaxSize
        if (goodsQuantity > goodsLimit || this.quantityInput > goodsLimit) {
          this.$store.commit('common/setMessage', `${this.item.goodsName} 最多可购买${goodsLimit}件`)
          return true
        }
      } else if (oprator === 2) {
        const minLimit = this.item.minLimit <= 0 ? 1 : this.item.minLimit
        if (this.item.goodsQuantity <= minLimit || this.quantityInput < minLimit) {
          this.$store.commit('common/setMessage', `${this.item.goodsName} ${minLimit}件起购`)
          return true
        }
      }
      return false
    },
    addQuantity (obj) {
      if (!this.flag) {
        this.flag = true
        const params = {
          goodsId: obj.goodsId,
          goodsQuantity: 1,
          isSelected: true,
          itemType: obj.itemType || 1
        }
        this.$store.dispatch('cart/addGoodsQuantity', params)
        .then(() => {
          this.flag = false
        })
        .catch((err) => {
          this.flag = false
          this.$store.commit('common/setMessage', err.msg || err)
        })
      }
    },
    reduceQuantity: function (obj) {
      if (!this.flag) {
        this.flag = true
        const params = {
          goodsId: obj.goodsId,
          goodsQuantity: 1,
          isSelected: true,
          itemType: obj.itemType || 1
        }
        this.$store.dispatch('cart/reduceGoodsQuantity', params)
        .then((res) => {
          this.flag = false
        })
        .catch((err) => {
          this.flag = false
          this.$store.commit('common/setMessage', err.msg || err)
        })
      }
    }
  },
  computed: {
  },
  watch: {
    goodsQuantity: {
      handler () {
        this.quantityInput = this.goodsQuantity
      }
    },
    quantityInput () {
    }
  },
  mounted () {
    if (!process.SERVER_BUILD) {
      this.isLogin = localStorage.getItem('sessionId') && localStorage.getItem('sessionId') !== 'undefined'
    }
    this.quantityInput = this.goodsQuantity
  }
}
</script>

<style lang="less">
  #change-num{
    .controller{
      border:solid 1px #d1d1d1;width: 70px;
      input{border:none;width: 30px;text-align: left;background: #f4f4f4;padding-left: 1px;}
      span{cursor: pointer;width: 20px;text-align: center;}
      .reduce{border-right:1px solid #d1d1d1;}
      .add{border-left:1px solid #d1d1d1;}
      .no_activate{
        color: #e5e5e5;
        cursor: default;
      }
    }
    .describe{font-size: 12px;color: #b7a078;margin-top: 10px;}
  }
</style>
