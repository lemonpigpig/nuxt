<template>
  <section>
    <gz-rich-text-viewer
      :contents="content"
      :gridColumn="24"
      @img-jump-to="imgJumpToHandler"
      type="pro"
      >
    </gz-rich-text-viewer>
  </section>
</template>

<script>
import Vue from 'vue'

export default {
  mounted () {
    this.$store.commit('common/setCurrentActivePage', this.$route.params.name)
    this.setTopicHandleConfig()
  },
  watch: {
    '$route': 'routeChange'
  },
  methods: {
    routeChange () {
      this.$store.commit('common/setCurrentActivePage', this.$route.params.name)
    },
    imgJumpToHandler ({imgURL, linkValue, linkType}) {
      if (!linkType || !linkValue) {
        throw new Error('请正确配置linkType和linkValue')
      }
      if (Vue.$isServer) return
      this.topicHandleConfig[linkType].bind(this, linkValue)()
    },
    setTopicHandleConfig () {
      this.topicHandleConfig = {
        topicUrl (linkValue) {
          global.open(`/promotion/${linkValue}`)
        },
        productId (goodsId) {
          global.open(`/goods/${goodsId}`)
        },
        couponId (couponId) {
          this.$store.dispatch('promotion/receiveCoupon', couponId).then((data) => {
            if (data && data.couponNo) {
              this.$store.commit('common/setMessage', '领取成功')
              this.$store.dispatch('promotion/getCouponsList')
            }
          }).catch((err) => {
            this.$store.commit('common/setMessage', err)
          })
        }
      }
    }
  },
  async asyncData ({ params, redirect, error }) {
    if (!params.name) {
      return error({ statusCode: 404, message: 'Promotion short name is empty!' })
    }
    try {
      const { data } = await Vue.axios.get(`/cms/topic/${params.name}`)
      if (!data || !data.content) {
        // throw new Error('404')
        return error({ statusCode: 404, message: 'Promotion short name is empty!' }) // TODO: to be changed to redirect to 404 page
      }
      let content = null
      try {
        content = JSON.parse(data.content)
      } catch (e) {
        // throw e
        return error({ statusCode: 500, message: `Failed to parse promotion content, promotion name: ${params.name}` })
      }
      return { content, title: data.title }
    } catch (e) {
      throw e
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

<style lang="less">
@import url("../../assets/less/mixins.less");
@import url("../../assets/less/richTextViewer.less");

.gz-rich-text-viewer-pro {
  font-size: 0;
  .link:hover {
    cursor: pointer;
  }
  .make-cols(6, 6)
}
</style>
