<template lang="html">
  <div class="flash-sale">
    <div class="banner">
      <gz-slider :options="sliderOptions" :items="sliderItems"  @customClick="customClick">
      </gz-slider>
    </div>
    <home-template source="flashsale"/>
  </div>
</template>

<script>
import Home from '~components/biz/home'
import generateBannerUri from '~/plugins/banner-url.js'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'

export default {
  mixins: [SeoMixin],
  async asyncData () {
    try {
      const info = await SeoService.getSeoInfo({ pageTypeKey: 5 })
      return { seoInfo: info }
    } catch (e) {
      throw e
    }
  },
  components: {
    [Home.Template.name]: Home.Template
  },
  methods: {
    customClick (data) {
      console.log(data)
      window.open(data)
    }
  },
  mounted () {
    this.$store.commit('common/setCurrentActivePage', this.$route.name)
    this.$store.dispatch('common/getBanner', {
      Type: 1, PageTypeKey: 5, PositionKey: 21, DisplayCategoryId: '', FeatureMuseumId: 0
    }).then((data) => {
      this.$set(this, 'sliderItems', data.length ? data.map(image => Object.assign({}, image, {
        background: image.imgs,
        url: generateBannerUri(image.module, image.linkUrl),
        customClickData: generateBannerUri(image.module, image.linkUrl)
      })) : [{
        background: '',
        url: ''
      }])
    })
    this.$store.commit('common/setBreadCrumbVisibility', false)
  },
  data () {
    return {
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
  }
}
</script>

<style lang="less">
.flash-sale{
  margin-bottom: 93px;
  .banner{
    width: 1200px;
    margin: 0 auto;
    height: 320px;
  }
}
</style>
