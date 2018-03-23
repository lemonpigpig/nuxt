<template>
  <div class="museum-home" id="museum-home">
      <div class="museum-banner">
          <div class="banner-img" :style="{'background-image': `url(${museumBanner.imgs})`}" @click="goUrl(museumBanner)"></div>
          <div class="img-wrapper">
              <div class="small-banner-img">
                  <div class="small-img-style" :style="{'background-image': `url(${museumBannerOne.imgs})`}" @click="goUrl(museumBannerOne)"></div>
                  <div class="small-img-style" :style="{'background-image': `url(${museumBannerTwo.imgs})`}" @click="goUrl(museumBannerTwo)"></div>
              </div>
          </div>
      </div>
      <div class="wrapper">
        <div class="museum-new">
            <div class="museum-name">最新开馆</div>
            <div class="museum-description">精选云南优质高原特产、特色文化等产品</div>
        </div>
        <div class="museum-content">
            <div class="museum-item-margin" v-for="item in museumsNew.slice(0,6)">
                <museum-abstract :museumItem="item" @getMuseum="getMuseumAndGo"></museum-abstract>
            </div>
        </div>
        <div class="museum-all" @click="goAll">
          <gz-icon icon="half-arrow" size="24"></gz-icon>
        </div>
      </div>
    <div class="museum-body" v-for="museum in floorList">
      <div class="wrapper" v-if="museum.pageTemplate === '23'">
        <museum-detail :museum="museum"></museum-detail>
      </div>
      <div class="museum-banner" v-if="museum.pageTemplate === '12'">
          <div class="middle-banner-img" :style="{'background-image': `url(${museum.tags[0].advertisements[0].imgs})`}"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import Museum from '~components/biz/museum'
import generateBannerUri from '~/plugins/banner-url.js'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'

export default {
  mixins: [SeoMixin],
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 23 }) }
    } catch (e) {
      throw e
    }
  },
  components: {
    [Museum.MuseumAbstract.name]: Museum.MuseumAbstract,
    [Museum.MuseumDetail.name]: Museum.MuseumDetail
  },
  computed: {
    floorList () { return this.$store.state.common.floorList }
  },
  data () {
    return {
      museumsNew: [],
      queryBody: {
        paging: {
          pageSize: 6,
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
      museumBanner: '',
      museumBannerOne: '',
      museumBannerTwo: ''
    }
  },
  methods: {
    goUrl (item) {
      if (generateBannerUri(item.module, item.linkUrl)) {
        window.open(generateBannerUri(item.module, item.linkUrl))
      }
    },
    goAll () {
      window.open('/museums/all')
    },
    getMuseumAndGo (museumInfo) {
      window.open(`/museums/${museumInfo.id}`)
    }
  },
  created () {
    this.$store.commit('common/setCurrentActivePage', this.$route.name.split('-')[0])
    this.$store.dispatch('common/getFloor', {
      'Type': 1,
      'PageTypeKey': 23,
      'DisplayCategoryId': '',
      'FeatureMuseumId': 0
    }).then(() => {
    })
    this.$store.dispatch('common/getBanner', { Type: 1, PageTypeKey: 23, PositionKey: 24, DisplayCategoryId: '', FeatureMuseumId: 0 }).then((data) => {
      if (data && data.length >= 3) {
        this.$set(this, 'museumBanner', data[0])
        this.$set(this, 'museumBannerOne', data[1])
        this.$set(this, 'museumBannerTwo', data[2])
      }
    })
    this.$store.dispatch('museums/getNewMuseums', this.queryBody).then((data) => {
      if (data && data.length > 0) {
        this.$set(this, 'museumsNew', data)
      }
    })
  },
  mounted () {
    // this.getFavoritesGoodsItemList()
  }
}
</script>

<style lang="less">
#museum-home{
  padding:0px 0px 60px;
  background-color: #f4f4f4;
  .museum-banner{
    width: 100%;
    background-color: #cccccc;
    .banner-img {
      height: 460px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
    }
    .middle-banner-img {
      height: 240px;
      margin-top: 70px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .img-wrapper{
      width: 1200px;
      margin: 0px auto;
      .small-banner-img {
        position: absolute;
        top: 0;
        margin-top:220px;
        margin-left: 1000px;
        z-index: 5;
        .small-img-style {
          width: 200px;
          height: 210px;
          margin-top: 12px;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;
          cursor: pointer;
        }
      }
    }
  }
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
  .museum-content {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .museum-item-margin {
      margin: 20px 0px;
    }
    .museum-item-margin:nth-child(3n-1) {
        margin-left: 45px;
        margin-right: 45px;
    }
  }
  .museum-all {
    width: 275px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:75px auto;
    background-color: white;
    cursor: pointer;
    &:hover {
        background-color: #ff4544;
        color: white;
    }
  }
}
</style>
