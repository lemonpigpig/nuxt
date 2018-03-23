<template lang="html">
    <div id="collection">
        <div v-show="!favoritesListData.length">
            <NoResult :tip="favouriteTip" :imgType="type"></NoResult>
        </div>
        <span style="float: left" v-for="item in favoritesListData" v-show="favoritesListData.length">
            <GoodsItem :item="item" :showRemove="true" @getDeleteId="cancelCollectSingle" titleSize="16px" width="249px" height="330px"></GoodsItem>
        </span>
    </div>
</template>

<script>
import GoodsItem from '~components/goods-item'
import NoResult from '~components/biz/account/no-result'

export default {
  name: 'collect-list',
  data () {
    return {
      type: 'collection',
      favouriteTip: '抱歉！您暂时还没有收藏的商品，赶快去收藏吧!'
    }
  },
  components: { GoodsItem, NoResult },
  computed: {
    favoritesListData () {
      return this.$store.state.account.favoritesList
    }
  },
  methods: {
    fetchData () {
      this.$store.dispatch('account/getFavoritesList').then((res) => {
        if (res) {
          this.formatData()
          this.$emit('sendIdList', this.favoritesListData.ids)
        }
      }).catch((err) => {
        this.$store.commit('common/setMessage', err || err.msg)
      })
    },
    formatData () {
      return this.favoritesListData && this.favoritesListData.map((item, index) => ({
        ids: item.id,
        stock: item.stock,
        goodsName: item.name,
        introduction: item.introduction,
        salePrice: item.salePrice
      }))
    },
    cancelCollectSingle (id) {
      if (id) {
        this.$store.dispatch('account/collectDeleteSingle', id).then(() => {
          const favoritesList = this.$store.state.account.favoritesList.filter(item => item.id !== id)
          this.$set(this.$store.state.account, 'favoritesList', favoritesList)
          this.$store.commit('common/setMessage', '删除成功')
          // this.fetchData()
        }).catch((err) => {
          this.$store.commit('common/setMessage', err.msg || err)
        })
      }
    },
    cancelCollectAll () {
      this.$store.dispatch('account/collectDeleteAll', this.favoritesListData.ids).then(() => {
        this.fetchData()
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="less">
#collection {
  overflow: hidden;
}
</style>
