<template>
<section class="wrapper help-center-index ">
  <!--<link href="//cdn.quilljs.com/1.0.0/quill.core.css" rel="stylesheet">-->
  <div class="wrapper">
    <left-navigation class="left-nav" :categoryList="categoryList" @open-page-detail="openPageDetail" :current-page-id="pageId"></left-navigation>
    <!--<gz-rich-text-viewer
        v-if="pageId != 'index'"
        :contents="content"
        :gridColumn="1"
        type="pro"
        class="content"
        >
    </gz-rich-text-viewer>-->
    <article class="content ql-editor" v-html="content">
    </article>
  </div>
</section>
</template>

<script>
import Vue from 'vue'
import LeftNavigation from '~components/biz/help-center/left-navigation'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'
import '~/assets/css/quill.core.css'

export default {
  mixins: [SeoMixin],
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 22 }) }
    } catch (e) {
      throw e
    }
  },
  data () {
    return {
      categoryList: this.$store.state['help-center'].categoryList
      // pageId: ''
    }
  },
  computed: {
    pageId () {
      return this.$route.params.id
    },
    content () {
      if (this.pageId === 'index') {
        const indexPage = this.$store.state['help-center'].indexPage
        if (indexPage) {
          return indexPage.content
        } else {
          return ''
        }
      } else {
        for (let i in this.$store.state['help-center'].categoryList) {
          const category = this.$store.state['help-center'].categoryList[i]
          if (category.pages != null && category.pages.length > 0) {
            for (let j in category.pages) {
              const page = category.pages[j]
              if (page.id === this.pageId && page.content) {
                return page.content
              }
            }
          }
        }
      }
    }
  },
  async fetch ({store, params}) {
    store.commit('common/setShowNavigation', false)
    if (params.id === 'index') {
      try {
        const indexRes = await Vue.axios.get(`/helpcenter/master`)
        store.commit('help-center/setIndexPage', indexRes.data)
      } catch (e) {
        throw e
      }
    } else {
      try {
        const pageDetailRes = await Vue.axios.get(`/helpcenter/pages/${params.id}`)
        store.commit('help-center/setPageDetail', pageDetailRes.data)
      } catch (e) {
        throw e
      }
    }
  },
  components: {
    [LeftNavigation.name]: LeftNavigation
  },
  validate ({ params }) {
    return !!params.id
  },
  methods: {
    openPageDetail (pageId) {
      // this.pageId = pageId
      this.$router.push(`/help-center/${pageId}`)
      // global.history.pushState({}, 'helpCenterPageDetail', `/help-center/${pageId}`)
      // if (this.content == null) {
      //   this.$store.dispatch('help-center/getPageDetail', pageId)
      // }
    }
  },
  // created () {
  //   // this.pageId = this.$route.params.id
  // },
  // created () {
  //   this.$store.commit('common/setShowNavigation', true)
  // }
  mounted () {
    this.$store.commit('common/setShowNavigation', true)
  },
  updated () {
    this.$store.commit('common/setShowNavigation', true)
  }
}
</script>

<style lang="less">
.help-center-index {
  border-top: 1px solid #f4f4f4;
  margin-bottom: 171px;
  .wrapper {
    overflow: hidden;
    margin-top: 40px;
    .left-nav {
      float: left;
      width: 184px;
      background-color: #f4f4f4;
    }
    .content {
      float: right;
      width: 940px;
      font-size: 14px;
      padding: 0;
      .help-paragraph {
        p:empty {
          margin-top: 20px;
        }
      }
      .help-title h1 {
        font-size: 16px;
      }
    }
  }
}
</style>
