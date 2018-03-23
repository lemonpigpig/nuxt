<template>
  <div class="home-main">
    <div class="layouts" >
      <header-banner/>
    </div>
    <div class="layouts" v-for="item in floorList">
        <cloud-template v-if="item.pageTemplate==17 || item.pageTemplate==18 || item.pageTemplate==19 || item.pageTemplate==20" :goodList="item"/>
        <small-goods-recommand v-if="item.pageTemplate==16" :goodList="item"/>
        <home-template  v-if="item.pageTemplate==6"/>
        <goods-recommand v-if="item.pageTemplate==15" :goodList="item"/>
        <advertisement v-if="item.pageTemplate==12" :goodList="item"/>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import Home from '~components/biz/home'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'

export default {
  middleware: 'check-auth',
  components: {
    [Home.Template.name]: Home.Template,
    [Home.Cloud.name]: Home.Cloud,
    [Home.Advertisement.name]: Home.Advertisement,
    [Home.GoodsRecommand.name]: Home.GoodsRecommand,
    [Home.HeaderBanner.name]: Home.HeaderBanner,
    [Home.SmallGoodsRecommand.name]: Home.SmallGoodsRecommand
  },
  computed: {
    floorList () { return this.$store.state.common.floorList }
  },
  data () {
    return {
      // floorList: []
    }
  },
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 1 }) }
    } catch (e) {
      throw e
    }
  },
  mounted () {
    this.$store.commit('common/setCurrentActivePage', this.$route.name)
    this.$store.commit('common/setBreadCrumbVisibility', false)
    this.$store.dispatch('common/getFloor', { pageTypeKey: 1, displayCategoryId: '', FeatureMuseumId: 0 })
  },
  mixins: [SeoMixin]
}
</script>

<style lang="less">
.home-main{
  background: #f4f4f4;
  .layouts{
    padding-bottom: 60px;
  }
}
</style>
