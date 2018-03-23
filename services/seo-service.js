import Vue from 'vue'

export class SeoService {
  static async getSeoInfo ({ pageTypeKey, displayCategoryId = '', featureMuseumId = 0 }) {
    try {
      const res = await Vue.axios.post('/keywords/seo', {
        pageTypeKey,
        displayCategoryCode: displayCategoryId,
        featureMuseumId
      })
      if (res && res.data && res.data.length > 0) {
        const tkd = res.data[0]
        return { seoTitle: tkd.title, seoKeywords: tkd.keywords, seoDescription: tkd.description }
      }
    } catch (e) {
      throw e
    }
    return null
  }
  // static async getSeoMeta ({ pageTypeKey, displayCategoryId = '', featureMuseumId = 0 }) {
  //   const seoInfo = await this.getSeoInfo()
  //   if (seoInfo.seoTitle || seoInfo.seoKeywords || seoInfo.seoDescription) {
  //     return {
  //       title: seoInfo.seoTitle,
  //       meta: [
  //         { hid: 'Description', name: 'Description', content: seoInfo.seoDescription },
  //         { hid: 'Keywords', name: 'Keywords', content: seoInfo.seoKeywords }
  //       ]
  //     }
  //   }
  //   return {}
  // }
}
