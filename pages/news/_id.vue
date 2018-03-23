<template lang="html">
    <div id="newsdetail">
        <breadCrumb :breadCrumb="breadCrumb"></breadCrumb>
        <div class="news">
            <h2>{{newsDetail.title}}</h2>
            <h6>时间：{{createTime.replace(/T/, ' ')}}</h6>
            <div class="content">
                <div class="ql-editor" v-html="newsDetail.content"></div>
            </div>
        </div>
        <recommend-goods :pageTypeKey="24" :positionKey="23" class="recommend-goods"></recommend-goods>
    </div>
</template>

<script>
import RecommendGoods from '~components/recommend-goods'
import breadCrumb from '~components/biz/breadcrumb/breadcrumb.vue'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'
import '~/assets/css/quill.core.css'

export default {
  data () {
    return {
      previewContent: [],
      createTime: ''
    }
  },
  mixins: [SeoMixin],
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 18 }) }
    } catch (e) {
      throw e
    }
  },
  components: {
    breadCrumb,
    [RecommendGoods.name]: RecommendGoods
  },
  computed: {
    breadCrumb () {
      return [{ name: '首页', url: '/' }, { name: '新闻公告', url: '/news/list' }, { name: '新闻公告内容' }]
    },
    newsDetail () { return this.$store.state.account.newsDetail }
  },
  methods: {
    fetchData () {
      this.$store.dispatch('account/getNewsDetial', this.$route.params.id).then(() => {
        this.$set(this, 'createTime', this.newsDetail.startTime)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="less">
  // @import "~assets/less/components/_richText.less";
  #newsdetail {
      width: 1200px;
      margin: 0px auto 20px auto;
      .bread-crumb {
        border-bottom: none;
        margin-bottom: 0px;
      }
      .news {
          padding: 30px 30px 200px 30px;
          border: 1px solid #eee;
          h2 {
              color: #333;
              font-size: 20px;
              font-weight: 600;
              text-align: center;
          }
          h6 {
            margin-top: 10px;
            color: #999;
            font-size: 14px;
            text-align: center;
          }
          .content {
              margin-top: 36px;
              color: #666;
              font-size: 14px;
              line-height: 24px;
          }
      }
      // .richText-columns(1);
      .recommend-goods {
        margin: 41px auto 96px;
      }
  }
</style>
