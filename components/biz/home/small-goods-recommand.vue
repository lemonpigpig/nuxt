<template lang="html">
  <div class="small-goods-recommand">
    <div class="goods-recommand" v-for="item in goodList.tags">
      <div class="goods-small" v-for="(child, index) in item.advertisements" v-if="index < 4">
        <div class="goods-img" :style="{background: item.background}">
            <img :src="child.imgs" alt="" @click="goUrl(child)">
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  name: 'small-goods-recommand',
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
.small-goods-recommand{
  width: 100%;
  background: white;
  height: 220px;
  margin-top: -60px;
  .goods-recommand{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    padding-left: 240px;
    .goods-small{
        width: 240px;
        height: 200px;
        .goods-img{
          width: 100%;
          height: 100%;
          border: 1px solid #f4f4f4;
          border-left: 0;
          img{
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
      }
  }
}
</style>
