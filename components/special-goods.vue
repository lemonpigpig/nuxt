<template lang="html">
  <div class="special-goods-section" id="special-goods-section">
    <div class="content-title">精选商品</div>
    <div class="content-no-data" v-if="!goodsItems || goodsItems.length === 0">暂无相关精选商品</div>
    <div class="content-main" v-for="item in goodsItems" @click="getDetail(item)">
      <div class="content-img"  :style="{'background-image': `url(${item.imageCover})`}"></div>
      <div class="tag-items">
        <gz-tag backgroundColor="#555c78" v-if="item.isAbholung">
          <span slot="tag-text">自提</span>
        </gz-tag>
      </div>
      <div class="content-name">{{item.name}}</div>
      <div class="content-description">{{item.introduction}}</div>
      <div class="content-price">￥{{item.salePrice}}</div>
    </div>
  </div>
</template>

<script>
import Tag from '~components/biz/tag/tag'

export default {
  name: 'special-goods',
  data () {
    return {
      itemObj: {}
    }
  },
  props: {
    goodsItems: {
      type: Array,
      default: () => []
    }
  },
  components: {
    [Tag.name]: Tag
  },
  methods: {
    getDetail (item) {
      var id = item.id || item.goodsId
      window.open(`/goods/${id}`)
    }
  }
}
</script>

<style lang="less">
#special-goods-section{
    width: 179px;
    margin-bottom: 20px;
    .content-title {
      text-align: center;
      font-size: 14px;
      padding:8px 0px;
      background-color: #ff4544;
      color: white;
    }
    .content-no-data {
      text-align: center;
      color: #999999;
      font-size: 14px;
    }
    .content-main {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 15px 10px;
      border-bottom: 1px solid #f4f4f4;
      cursor: pointer;
      .content-img {
          width: 90px;
          height: 90px;
          background-color: #dddddd;
          margin:15px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
      }
      .content-name {
        width: 100%;
        text-align: center;
        font-size: 14px;
      	font-weight: 600;
      	letter-spacing: -0.8px;
      	color: #333333;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .content-description {
        width: 100%;
        text-align: center;
        font-size: 12px;
      	letter-spacing: -0.7px;
        margin-top: 3px;
      	color: #999999;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .content-price {
        margin: 15px 0px;
        font-size: 16px;
      	color: #ff4544;
      }
    }
    &:last-child {
      margin-bottom: 0px;
    }
    .tag-items {
      margin-bottom: 5px;
      text-align: center;
    }
}

</style>
