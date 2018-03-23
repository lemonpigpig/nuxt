<template lang="html">
  <div>
    <div class="goods-recommand" v-for="item in goodList.tags">
      <div class="goods-large" v-for="child in item.advertisements">
        <div class="goods-img"  >
          <img :src="child.imgs" alt="" @click="goUrl(child)">
        </div>
      </div>
    </div>



  </div>
</template>

<script>
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  name: 'goods-recommand',
  data () {
    return {
      // goodsList: []
    }
  },
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
  },
  mounted () {}
}
</script>

<style lang="less">
.goods-recommand{
  width: 1200px;
  margin: 0 auto;
  display: flex;
  margin-top: -60px;
  .goods-large{
    width: 300px;
    height: 360px;
    .goods-img{
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }
}
</style>
