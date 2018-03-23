<template>
  <div class="museum-single" id="museum-single">
    <div class="wrapper">
      <div class="museum-banner" v-if="museumBanner && museumBanner.length>0"  @click="goUrl(museumBanner[0])">
          <div class="banner-img" :style="{'background-image': `url(${museumBanner[0].imgs})`}"></div>
      </div>
      <div class="museum-content">
          <div class="museum-main" :style="{'background-image': `url(${museumBanner[1].imgs})`}" v-if="museumBanner && museumBanner.length>1" @click="goUrl(museumBanner[1])">
          </div>
          <div class="museum-sub" v-if="museumBanner && museumBanner.length>2">
              <div class="museum-img" v-for="item in museumBanner.slice(2,5)"
                   :style="{'background-image': `url(${item.imgs})`}" @click="goUrl(item)">
              </div>
          </div>
      </div>
      <div class="museum-goods">
          <div class="museum-title">特色产品</div>
          <div class="museum-description">精选云南优质高原特产、特色文化等产品</div>
      </div>
      <div class="category__header category__order">
        <span class="order__current">排序：</span>
        <span :class="[queryBody.sort[0].field === 0 ? 'order__current' : '', 'order__item']"
              @click="updateSort(0)">默认排序</span>
        <span class="order__item" @click="updateSort(2)">
          销量
          <gz-icon :class-name="['order__up', queryBody.sort[0].field === 2 && !queryBody.sort[0].isDesc ? 'order__current' : '']"
                   icon="order-up" size="5"></gz-icon>
          <gz-icon :class-name="['order__down', queryBody.sort[0].field === 2 && queryBody.sort[0].isDesc ? 'order__current' : '']"
                   icon="order-down" size="5"></gz-icon>
        </span>
        <span class="order__item" @click="updateSort(1)">
          价格
          <gz-icon :class-name="['order__up', queryBody.sort[0].field === 1 && !queryBody.sort[0].isDesc ? 'order__current' : '']"
                   icon="order-up" size="5"></gz-icon>
          <gz-icon :class-name="['order__down', queryBody.sort[0].field === 1 && queryBody.sort[0].isDesc ? 'order__current' : '']"
                   icon="order-down" size="5"></gz-icon>
        </span>
      </div>
      <div class="goods ft-center fn-clear">
        <div class="museum-no-data" v-if="formatGoods.length === 0">
          <div><gz-icon color="#FF8D00" size="40" icon="no-data"></gz-icon></div>
          抱歉！没有获取到相关的数据哦～
        </div>
        <div class="museum-goods-item">
          <div  v-for="(item, index) in formatGoods" :key="index">
            <goods-item :showDesc="true" :showCollection="true" :item="item" height="320px" width="240px"/>
          </div>
        </div>
      </div>
      <div class="category__pagination" v-if="getMuseumGoodsPaging.total > 0">
          <pagination :paging="getMuseumGoodsPaging" @setPage="updatePagination"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '~components/goods-item'
import Pagination from '~components/pagination'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  components: {
    [GoodsItem.name]: GoodsItem,
    Pagination
  },
  computed: {
    getMuseumDetail () { return this.$store.state.museums.museumDetail },
    getMuseumGoodsPaging () {
      return this.$store.state.museums.museumGoodsPaging
    },
    formatGoods () {
      var list = this.$store.state.museums.goodsByMuseumId
      return list.map((item) => {
        const targetItem = item
        this.$set(targetItem, 'goodsName', targetItem.name)
        this.$set(targetItem, 'stock', targetItem.availableStock)
        return targetItem
      })
    }
  },
  data () {
    return {
      queryBody: {
        paging: {
          pageSize: 20,
          pageIndex: 1
        },
        sort: [
          {
            field: 0,
            isDesc: true
          }
        ],
        condition: {}
      },
      museumBanner: []
    }
  },
  async asyncData ({ params }) {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 3, featureMuseumId: params.id }) }
    } catch (e) {
      throw e
    }
  },
  mixins: [SeoMixin],
  methods: {
    goUrl (item) {
      if (generateBannerUri(item.module, item.linkUrl)) {
        window.open(generateBannerUri(item.module, item.linkUrl))
      }
    },
    updatePagination (index) {
      if (index) {
        this.queryBody.paging.pageIndex = index
        this.queryGoods()
      }
    },
    queryGoods () {
      var params = {
        id: this.$route.params.id,
        body: this.queryBody
      }
      this.$store.dispatch('museums/getGoodsByMuseumId', params)
    },
    updateSort (field) {
      this.queryBody.sort[0].field = field
      if (field === 0) {
        this.queryBody.sort.isDesc = true
      } else {
        this.queryBody.sort[0].isDesc = !this.queryBody.sort[0].isDesc
      }
      this.queryGoods()
    },
    formatIntroduction (item) {
      let content = ''
      if (item) {
        const newItem = JSON.parse(item)
        newItem.forEach((it) => {
          if (it.type === 'paragraph') {
            content = it.content
          }
        })
      }
      return content
    }
  },
  mounted () {
    this.$store.commit('common/setCurrentActivePage', this.$route.name.split('-')[0])
    var museumId = this.$route.params.id
    this.$store.commit('common/setBreadCrumbVisibility', true)
    this.$store.dispatch('museums/getMuseumDetail', museumId).then(() => {
      this.$store.commit('common/setBreadCrumbList', [{
        name: '一县一馆',
        url: '/museums'
      }, {
        name: '所有馆',
        url: '/museums/all'
      }, {
        name: this.getMuseumDetail.name
      }])
    })
    this.$store.dispatch('common/getBanner', {
      'Type': 1,
      'PageTypeKey': 3,
      'PositionKey': 4,
      'DisplayCategoryId': '',
      'FeatureMuseumId': this.$route.params.id
    }).then((data) => {
      this.$set(this, 'museumBanner', data)
    })
    this.queryGoods()
  }
}
</script>

<style lang="less">
#museum-single{
  background-color: #f4f4f4;
  padding:0px 0px 30px;
  .museum-banner{
    width: 100%;
    height: 320px;
    background-color: #cccccc;
    .banner-img {
      height: 320px;
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      cursor: pointer;
    }
  }
  .museum-goods {
    width: 100%;
    text-align: center;
    .museum-title {
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
  .museum-content {
    width: 100%;
    height: 400px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    .museum-main {
      width: 360px;
      margin-right: 20px;
      color: white;
      text-align: center;
      background-color: #652515;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      cursor: pointer;
      .museum-name{
        font-size: 40px;
      	font-weight: 100;
      	line-height: 1.25;
        margin:50px auto 10px;
      }
      .museum-pinyin {
        font-size: 16px;
	      font-weight: 200;
        margin-bottom: 40px;
      }
      .museum-introduction {
        padding: 0px 30px;
        font-size: 14px;
      	font-weight: 300;
      	line-height: 1.43;
      	text-align: justify;
      }
    }
    .museum-sub {
      width: 820px;
      display: flex;
      justify-content: space-between;
      .museum-img {
        width: 260px;
        background-color: #cccccc;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        cursor: pointer;
      }
    }
  }
  .museum-no-data {
    color: #999999;
    margin: 75px auto 175px;
    .gz-icon {
      margin-bottom: 10px;
    }
  }
  .museum-goods-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-left: 1px solid #f4f4f4;
    box-sizing: content-box;
  }
}
</style>
