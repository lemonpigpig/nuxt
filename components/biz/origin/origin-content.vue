<template lang="html">
  <div id="origin-component">
    <div class="origin-title">
        <div class="title-name">{{title}}</div>
        <div class="title-desc">{{tag.name}}</div>
    </div>
    <div class="content">
      <div class="content-first" :style="{'background-image': `url(${tag.advertisements[0].imgs})`}" @click="goUrl(tag.advertisements[0])"></div>
      <div class="content-second">
        <div class="content-sub-img"  :style="{'background-image': `url(${tag.advertisements[1].imgs})`}" @click="goUrl(tag.advertisements[1])"></div>
        <div class="content-sub-img"  :style="{'background-image': `url(${tag.advertisements[2].imgs})`}" @click="goUrl(tag.advertisements[2])"></div>
      </div>
      <div class="content-third">
        <div v-for="good in tag.goods.slice(0, 6)">
            <goods-item :item="good" :showDesc="false" width="200px"></goods-item>
        </div>
      </div>
    </div>
    <div class="content-goods" v-if="showGoods">
      <div v-for="good in tag.goods.slice(6, 12)">
          <goods-item :item="good" :showDesc="false" width="200px"></goods-item>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '~components/goods-item'
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  name: 'origin-content',
  data () {
    return {
    }
  },
  components: {
    [GoodsItem.name]: GoodsItem
  },
  props: {
    showGoods: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: ''
    },
    tag: {
      type: Object,
      default: {}
    }
  },
  methods: {
    goUrl (item) {
      if (generateBannerUri(item.module, item.linkUrl)) {
        window.open(generateBannerUri(item.module, item.linkUrl))
      }
    }
  },
  computed: {
    getImgsUrl (index) {
      if (this.tag.advertisements && this.tag.advertisements[index] && this.tag.advertisements[index].imgs) {
        return `url(${this.tag.advertisements[index].imgs})`
      }
    }
  },
  mounted () {}
}
</script>

<style lang="less">
#origin-component{
  margin-bottom: 50px;
  .origin-title {
      display: flex;
      .title-name {
        font-size: 22px;
	      color: #333333;
      }
      .title-desc {
          border-left: 1px solid black;
          padding-left: 10px;
          margin-left: 15px;
          margin-top: 10px;
          font-size: 14px;
          line-height: 14px;
          height: 14px;
	        text-align: justify;
	        color: #333333;
      }
  }
  .content {
      display: flex;
      .content-first {
          width: 260px;
          height: 520px;
          background-color: #ebebeb;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          cursor: pointer;
      }
      .content-second {
          .content-sub-img {
              width: 340px;
              height: 260px;
              background-color: #d0d0d0;
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;
              cursor: pointer;
              &:last-child{
                background-color: #e0e0e0;
              }
          }
      }
      .content-third {
        width: 600px;
        display: flex;
        flex-wrap: wrap;
      }
  }
  .content-goods {
      display: flex;
      flex-wrap: wrap;
  }
}
</style>
