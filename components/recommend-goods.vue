<template>
  <div class="recommend-section" v-show="recommendGoods && recommendGoods.length > 0">
    <div class="recommend-header"><span class="recommend-text">为您推荐</span></div>
    <div id="swiper-container" class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" style="width: 240px" v-for="goods in recommendGoods" v-bind:key="goods.id">
          <goods-item
          :item="goods"
          :showCollection="true"
          width="240px"
          height="320px"
          titleColor="#333"
          introductionSize="14px"
          introductionColor="#999"
          priceFontWeight="normal"></goods-item>
        </div>
      </div>
    </div>
    <div class="swiper-button-next swiper-button"></div>
    <div class="swiper-button-prev swiper-button"></div>
  </div>
</template>

<script>
import Vue from 'vue'
// import Swiper from 'swiper'
import GoodsItem from './goods-item'
let Swiper
const isServer = Vue.prototype.$isServer

if (!isServer) {
  Swiper = require('swiper') // eslint-disable-line global-require
}

export default {
  name: 'recommendGoods',
  props: {
    pageTypeKey: {
      type: Number,
      required: true
    },
    positionKey: {
      type: Number,
      required: true
    }
  },
  computed: {
    recommendGoods () {
      return this.$store.state.goods.recommendGoods
    }
  },
  async mounted () {
    try {
      await this.$store.dispatch('goods/getRecommendGoods', {pageTypeKey: this.pageTypeKey, positionKey: this.positionKey})
      if (!isServer) {
        new Swiper('.swiper-container', {// eslint-disable-line no-new
          slidesPerView: 4,
          paginationClickable: true,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev'
        })
      }
    } catch (e) {
      throw e
    }
  },
  components: {
    [GoodsItem.name]: GoodsItem
  }
}
</script>

<style lang="less">
.recommend-section {
  position: relative;
  height: 355px;
  overflow: hidden;
  width: 100%;
  background-color: white;
  .recommend-header {
    width: 100%;
    height: 36px;
    background-color: #ff4544;
    text-align: left;
    .recommend-text {
      font-size: 16px;
      color: white;
      line-height: 36px;
      margin: 0 20px;
    }
  }
  .swiper-container {
      width: 961px;
      height: 320px;
  }
  .swiper-button {
    position: absolute;
    top: 180px;
    width: 32px;
    height: 32px;
    margin-top: 0;
    background-size: cover;
    background-image: url('../assets/img/left-arrow-red.svg');
    &.swiper-button-disabled {
      background-image: url('../assets/img/left-arrow-gray.svg');
    }
  }
  .swiper-button-prev {
    left: 44px;
  }
  .swiper-button-next {
    right: 44px;
    transform: rotateY(180deg)
  }
}
</style>
