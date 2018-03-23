<template lang="html">
  <div class="header-banner">
    <div class="banner">
      <gz-slider :options="sliderOptions" :items="sliderItems" @customClick="customClick">
      </gz-slider>
    </div>
  </div>
</template>

<script>
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  name: 'header-banner',
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
        lazyLoading: true,
        paginationClickable: true
      },
      sliderItems: []
    }
  },
  methods: {
    customClick (data) {
      window.open(data)
    }
  },
  mounted () {
    this.$store.dispatch('common/getBanner', {
      Type: 1, PageTypeKey: 1, PositionKey: 1, DisplayCategoryId: '', FeatureMuseumId: 0
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
  }
}
</script>

<style lang="less">
// .swiper-lazy-loaded{
//   height: 400px;
// }
.header-banner{
  width: 100%;
  background: white;
  .banner{
    width: 100%;
    height: 420px;
  }

}
</style>
