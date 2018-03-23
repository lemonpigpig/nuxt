<template lang="html">
  <div class="museum-detail">
      <div class="museum-new">
          <div class="museum-name">{{museum.title}}</div>
          <div class="museum-description">{{museum.tags[0].name}}</div>
      </div>
      <div class="museum-body-content">
          <div class="museum-main" :style="{'background-image': `url(${museum.tags[0].advertisements[0].imgs})`}">
              <div class="museum-button" @click="goMuseum(museum.tags[0].advertisements[0].linkUrl)">查看{{museum.tags[0].advertisements[0].title}}</div>
          </div>
          <div class="museum-sub">
              <div class="museum-img" v-for="item in museum.tags[0].advertisements.slice(1,4)"
                   :style="{'background-image': `url(${item.imgs})`}" @click="goUrl(item)"></div>
          </div>
      </div>
      <div class="museum-goods-item" v-if="museum.tags[0].goods && museum.tags[0].goods.length>0">
        <div v-for="item in museum.tags[0].goods.slice(0,5)">
          <goods-item :showDesc="true" :showCollection="true" :item="item" height="325px" width="240px"/>
        </div>
      </div>
  </div>
</template>

<script>
import GoodsItem from '~components/goods-item'
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  name: 'museum-detail',
  props: {
    museum: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    [GoodsItem.name]: GoodsItem
  },
  methods: {
    goMuseum (id) {
      window.open(`/museums/${id}`)
    },
    goUrl (item) {
      if (generateBannerUri(item.module, item.linkUrl)) {
        window.open(generateBannerUri(item.module, item.linkUrl))
      }
    }
  }
}
</script>

<style lang="less">
.museum-detail {
  .museum-new {
    width: 100%;
    text-align: center;
    .museum-name {
      margin: 60px auto 0px;
      font-size: 22px;
    	font-weight: 600;
    	color: #333333;
    }
    .museum-description {
      font-size: 14px;
	    color: #999999;
      margin: 5px auto 30px;
    }
  }
  .museum-body-content {
    width: 100%;
    height: 400px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    .museum-main {
      width: 360px;
      margin-right: 20px;
      color: white;
      display: flex;
      flex-direction: column;
      text-align: center;
      background-color: #652515;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      .museum-name{
        font-size: 40px;
        font-weight: 100;
        line-height: 1.25;
        margin:50px auto 10px;
      }
      .museum-pinyin {
        display: flex;
        flex-grow: 1;
        margin: 0px auto;
        font-size: 16px;
        font-weight: 200;
      }
      .museum-button {
        padding: 10px 0px;
        width: 150px;
        margin: 335px auto 20px;
        font-size: 16px;
        color: #333333;
        background-color: white;
        text-align: center;
        cursor: pointer;
      }
    }
    .museum-sub {
      width: 820px;
      display: flex;
      justify-content: space-between;
      .museum-img {
        width: 260px;
        background-color: #cccccc;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
      }
    }
  }
  .museum-goods-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
