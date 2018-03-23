import { SeoService } from '~/services/seo-service.js'

export const SeoMixin = {
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 26 }) }// 默认页面类型为：其他所有页面
    } catch (e) {
      throw e
    }
  },
  head () {
    if (!this.seoInfo) {
      return {}
    }
    if (this.seoInfo.seoTitle || this.seoInfo.seoKeywords || this.seoInfo.seoDescription) {
      return {
        title: this.seoInfo.seoTitle,
        meta: [
          { hid: 'Description', name: 'Description', content: this.seoInfo.seoDescription },
          { hid: 'Keywords', name: 'Keywords', content: this.seoInfo.seoKeywords }
        ]
      }
    }
    return {}
  }
}
