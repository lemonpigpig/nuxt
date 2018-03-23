<template lang="html">
  <div class="first-category">
    <div class="banner">
      <gz-slider :options="sliderOptions" :items="sliderItems" @customClick="customClick">
      </gz-slider>
    </div>
    <div class="layouts" v-for="item in floorList">
        <cloud-template v-if="item.pageTemplate==14" :goodList="item"/>
        <small-goods-recommand v-if="item.pageTemplate==16" :goodList="item"/>
        <home-template  v-if="item.pageTemplate==6"/>
        <goods-recommand v-if="item.pageTemplate==15" :goodList="item"/>
        <advertisement v-if="item.pageTemplate==12" :goodList="item"/>
    </div>
  </div>
</template>

<script>
import Home from '~components/biz/home'
import generateBannerUri from '~/plugins/banner-url.js'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'

export default {
  data () {
    return {
      goodsList: [],
      sliderOptions: {
        height: '100%', // 高度
        width: '100%', // 宽度
        showPreNextButton: false, // 是否显示上一页、下一页
        showPagination: true, // 是否显示下方页码
        autoplay: 2500, // 自动播放间隔，false为不自动播放
        direction: 'horizontal', // 方向，默认'horizontal'横向，'vertical'为纵向
        lazyLoading: true
      },
      sliderItems: []
    }
  },
  components: {
    [Home.Template.name]: Home.Template,
    [Home.Cloud.name]: Home.Cloud,
    [Home.Advertisement.name]: Home.Advertisement,
    [Home.GoodsRecommand.name]: Home.GoodsRecommand,
    [Home.HeaderBanner.name]: Home.HeaderBanner,
    [Home.SmallGoodsRecommand.name]: Home.SmallGoodsRecommand
  },
  watch: {
    '$route': 'getBanner'
  },
  computed: {
    floorList () { return this.$store.state.common.floorList }
  },
  methods: {
    getBanner () {
      this.$store.dispatch('common/getBanner', {
        Type: 1, PageTypeKey: 2, PositionKey: 20, DisplayCategoryId: this.$route.query.code, FeatureMuseumId: 0
      }).then((data) => {
        this.sliderItems = data.length ? data.map(image => Object.assign({}, image, {
          background: image.imgs,
          url: generateBannerUri(image.module, image.linkUrl),
          customClickData: generateBannerUri(image.module, image.linkUrl)
        })) : [{
          background: '',
          url: ''
        }]
      })
      this.$store.dispatch('common/getFloor', { pageTypeKey: 2, displayCategoryId: this.$route.query.code, FeatureMuseumId: 0 })
    },
    customClick (data) {
      window.open(data)
    }
  },
  mounted () {
    this.$store.commit('common/setBreadCrumbVisibility', false)
    this.getBanner()
  },
  async asyncData ({ query }) {
    if (query.code) {
      try {
        const info = await SeoService.getSeoInfo({pageTypeKey: 2, displayCategoryId: query.code})
        return { seoInfo: info }
      } catch (e) {
        throw e
      }
    }
  },
  mixins: [SeoMixin]
}
</script>

<style lang="less">
.first-category{
  .layouts{
    margin-bottom: 60px;
  }
  .banner{
    width: 100%;
    height: 420px;
    margin-bottom: 40px;
  }
}
</style>
