<template lang="html">
    <div class="advertisement-layout">
      <div class="" v-for="item in goodList.tags">
        <div class="ad" v-for="child in item.advertisements">
          <img :src="child.imgs" alt="" @click="goUrl(child)">
        </div>
      </div>

    </div>
</template>

<script>
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  name: 'advertisement',
  props: {
    goodList: {}
  },
  methods: {
    goUrl (item) {
      if (generateBannerUri(item.module, item.linkUrl)) {
        window.open(generateBannerUri(item.module, item.linkUrl))
        // this.$router.push(generateBannerUri(item.module, item.linkUrl))
      } else {

      }
    }
  }
}
</script>

<style lang="less">
.advertisement-layout{
  height: auto;
  max-height: 240px;
  max-width: 1920px;
  margin: 0 auto;
  img{
    width: 100%;
    height: auto;
    max-height: 240px;
    cursor: pointer;
  }
  .ad{
    // background: #e3e3e3;
    width: 100%;
    height: 100%;

  }
}
</style>
