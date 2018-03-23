<template>
    <div id="origin-goods-page">
      <div class="body" v-for="item in floorList">
        <div class="wrapper" v-if="item.pageTemplate === '15'">
            <div class="header">
                <div class="header-banner" :style="{'background-image': `url(${item.tags[0].advertisements[0].imgs})`}"  @click="goUrl(item.tags[0].advertisements[0])"></div>
                <div class="header-tag">
                  <div class="tag-content" v-for="tag in item.tags.slice(1,4)"
                       :style="{'background-image': `url(${tag.advertisements[0].imgs})`}"
                       @click="goUrl(tag.advertisements[0])"
                  >
                  </div>
                </div>
            </div>
        </div>
        <div class="wrapper" v-if="item.pageTemplate === '22'">
            <origin-content :title="item.title" :tag="item.tags[0]" :showGoods="true"></origin-content>
        </div>
        <div class="origin-middle" v-if="item.pageTemplate === '12'" :style="{'background-image': `url(${item.tags[0].advertisements[0].imgs})`}"></div>
        <div class="wrapper" v-if="item.pageTemplate === '21'">
            <origin-content :title="item.title" :tag="item.tags[0]"></origin-content>
        </div>
      </div>
  </div>
</template>

<script>
import OriginContent from '~components/biz/origin'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  mixins: [SeoMixin],
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 4 }) }
    } catch (e) {
      throw e
    }
  },
  data () {
    return {
      queryCondition: {
        paging: {
          pageIndex: 1,
          pageSize: 999
        },
        sort: [{
          field: 0,
          isDesc: true
        }],
        condition: {
          Type: 1,
          PageTypeKey: 11,
          PositionKey: 5,
          DisplayCategoryId: '',
          FeatureMuseumId: 0
        }
      }
    }
  },
  components: {
    [OriginContent.name]: OriginContent
  },
  methods: {
    goUrl (item) {
      if (generateBannerUri(item.module, item.linkUrl)) {
        window.open(generateBannerUri(item.module, item.linkUrl))
      }
    }
  },
  computed: {
    floorList () { return this.$store.state.common.floorList }
  },
  created () {
    this.$store.commit('common/setCurrentActivePage', this.$route.name.split('-')[0])
    this.$store.commit('common/setBreadCrumbVisibility', false)
    this.$store.dispatch('common/getFloor', {
      'Type': 1,
      'PageTypeKey': 4,
      'DisplayCategoryId': '',
      'FeatureMuseumId': 0
    })
  }
}
</script>

<style lang="less">
#origin-goods-page{
  background-color: #f8f8f8;
  padding-bottom: 60px;
  .header {
    width: 100%;
    height: 500px;
    .header-banner {
      width: 100%;
      height: 360px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .header-tag {
      position: absolute;
      width: 760px;
      margin-top: -150px;
      margin-left: 220px;
      display: flex;
      justify-content: space-between;
      .tag-content {
        width: 200px;
        height: 240px;
        box-sizing: border-box;
        color: white;
        padding: 10px 18px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        opacity: 0.8;
        cursor: pointer;
        .tag-title {
          font-size: 40px;
          font-weight: 200;
          line-height: 46px;
        }
        .tag-desc {
          font-size: 19px;
          font-weight: 200;
          text-align: justify;
          margin: 6px 0px 10px;
        }
        .tag-name {
          display: flex;
          align-items: flex-end;
          .tag-name-character {
            font-size: 80px;
            font-weight: 200;
            line-height: 92px;
          }
          .tag-name-pinyin {
            font-size: 24px;
            font-weight: 200;
            line-height: 24px;
            margin-bottom: 17px;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .origin-middle {
      height: 240px;
      margin: 50px 0px;
      width: 100%;
      background-color: #ebebeb;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
  }
}
</style>
