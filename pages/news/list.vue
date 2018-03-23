<template lang="html">
    <div id="notice-list">
        <breadCrumb :breadCrumb="breadCrumb"></breadCrumb>
        <div class="notice-part">
            <div class="notice-content">
                <h3>新闻</h3>
                <ul>
                    <li v-for="item in noticeList">
                        <div>
                            <div class="news-head">
                                <h5 @click="showNewsInfo(item.id)">{{item.title}}</h5>
                                <span>{{item.startTime.replace(/T/, ' ').substring(0, 16)}}</span>
                            </div>
                            <div class="news-content">
                                <p v-html="item.content"></p>
                                <span @click="showNewsInfo(item.id)">了解更多</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="page">
                <pagination :paging="pagInfo" @setPage="updatePagination"></pagination>
            </div>
        </div>
        <div class="content-section">
            <special-goods :goodsItems="specialGoodsItems"/>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import breadCrumb from '~components/biz/breadcrumb/breadcrumb.vue'
import Pagination from '~components/pagination'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'
import SpecialGoods from '~components/special-goods'

export default {
  mixins: [SeoMixin],
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 24 }) }
    } catch (e) {
      throw e
    }
  },
  data () {
    return {
      query: {
        paging: {
          pageSize: 6,
          pageIndex: 1
        },
        sort: [
          {
            field: 3,
            isDesc: true
          }
        ],
        condition: {}
      },
      pagInfo: {
        total: this.total,
        currentPage: 1,
        pageSize: 20,
        pageCount: this.pageCount
      }
    }
  },
  computed: {
    breadCrumb () {
      return [{ name: '首页', url: '/' }, { name: '新闻公告' }]
    },
    noticeList () {
      if (!Vue.prototype.$isServer && global.DOMParser) {
        const parser = new global.DOMParser()
        for (let i in this.$store.state.account.noticeData.noticeList) {
          let dom = parser.parseFromString(this.$store.state.account.noticeData.noticeList[i].content, 'text/html')
          if (dom) {
            const body = dom.querySelector('body')
            // if (body.textContent) {
            //   this.$set(this.$store.state.account.noticeData.noticeList[i], 'content', body.textContent.slice(0, 180))
            // }
            const allParagraphs = body.querySelectorAll('p')
            for (const p of allParagraphs) {
              if (p.textContent && p.textContent.length > 0) {
                // const firstChild = p.children[0]
                // if (firstChild && firstChild.tagName === 'IMG') {
                //   continue
                // }
                this.$set(this.$store.state.account.noticeData.noticeList[i], 'content', p.textContent.slice(0, 110) + (p.textContent.length > 110 ? '...' : ''))
                break
              }
            }
          }
        }
      }
      return this.$store.state.account.noticeData.noticeList
    },
    paging () { return this.$store.state.account.noticeData.paging },
    specialGoodsItems () { return this.$store.state.goodsBasic.specialGoods.slice(0, 4) }
  },
  methods: {
    updatePagination (index) {
      if (index) {
        this.query.paging.pageIndex = index
        this.fetchData()
      }
    },
    showNewsInfo (id) {
      this.$router.push(`/news/${id}`)
    },
    fetchData () {
      this.$store.dispatch('account/getnoticeList', this.query).then(() => {
        this.$store.dispatch('goodsBasic/specialGoods', '')
        .catch((err) => {
          this.$store.commit('common/setMessage', err.msg || err)
        })
        this.$set(this.pagInfo, 'total', this.paging.total)
        this.$set(this.pagInfo, 'pageCount', this.paging.pageCount)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    }
  },
  mounted () {
    this.fetchData()
  },
  components: { Pagination, SpecialGoods, breadCrumb }
}
</script>

<style lang="less">
  #notice-list {
      width: 1200px;
      margin: -27px auto 80px auto;
      overflow: hidden;
      .bread-crumb {
        border-bottom: none;
        margin-bottom: 0px;
      }
      .notice-part {
          float: left;
          border: 1px solid #eee;
          width: 996px;
          padding-bottom: 39px;
          .notice-content{
              overflow: hidden;
              h3 {
                  padding-left: 20px;
                  line-height: 36px;
                  color: #fff;
                  background: #ff4544;
                  font-size: 15px;
                  font-weight: 500;
              }
              ul {
                  box-sizing: border-box;
                  width: 1000px;
                  min-height: 919px;
                  padding: 20px 20px 80px 20px;
                  li {
                      padding-bottom: 20px;
                      margin-bottom: 30px;
                      border-bottom: 1px solid #eee;
                      .news-head {
                          overflow: hidden;
                          span {
                            float: right;
                            color: #999;
                            font-size: 12px;
                          }
                          h5 {
                              float: left;
                              font-size: 16px;
                              font-weight: 600;
                              color: #333;
                          }
                      }
                      .news-content {
                          margin-top: 10px;
                          overflow: hidden;
                          p {
                              display: inline;
                              font-size: 14px;
                              color: #999;
                              line-height: 24px;
                          }
                          span {
                              display: inline;
                              margin-left: 5px;
                              font-size: 14px;
                              color: #ff4544;
                              cursor: pointer;
                          }
                      }
                  }
              }
          }
          .page {
            text-align: center;
          }
      }
      .content-section {
          float: left;
          width: 181px;
          margin-left: 20px;
          border: 1px solid #eee;
          .content-main .content-img {
              width: 100px;
              height: 100px;
          }
      }
  }
</style>
