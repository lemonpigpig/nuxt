import Vue from 'vue'
import HelpCenterService from '~/services/help-center-service.js'

export const state = () => ({
  categoryList: [],
  indexPage: {}
})

export const getters = {
  categoryListInFooter (state) {
    let categoryList = state.categoryList
    .filter(c => c.pages.findIndex(p => p.isShowFooter) > -1)
    .map(c => Object.assign({}, c))
    // return categoryList
    if (categoryList.length > 0) {
      categoryList.forEach((c) => {
        c.pages = c.pages.filter(p => p.isShowFooter).map(p => Object.assign({}, p))
      })
      return categoryList
    } else {
      return []
    }
  }
}

export const mutations = {
  setCategoryList (state, data) {
    data = data.filter(c => c.pages != null)
    data.forEach(c => c.pages.sort((a, b) => { return a - b }))
    Vue.set(state, 'categoryList', data.filter(c => c.pages != null))
  },
  setPageDetail (state, {id, title, content, categoryId}) {
    if (!id || !title || !content || !categoryId) {
      throw new Error(`Incorrect page info.`)
    }

    if (state.categoryList.length === 0 || state.categoryList.findIndex(c => c.id === categoryId) === -1) {
      throw new Error(`Category list is empty.`)
    }

    const category = state.categoryList.find(c => c.id === categoryId)
    if (category == null) {
      throw new Error(`Cannot find category ${categoryId} in category list.`)
    }

    if (category.pages.length === 0) {
      throw new Error(`No pages in category: ${categoryId}`)
    }

    let page = category.pages.find(c => c.id === id)
    if (page == null) {
      throw new Error(`Cannot find page: ${id}`)
    }
    Vue.set(page, 'content', content)
  },
  setIndexPage (state, {content}) {
    Vue.set(state, 'indexPage', {content})
  }
}

export const actions = {
  getCategoryList ({
    commit
  }) {
    return new Promise((resolve, reject) => {
      HelpCenterService.getCategoryList()
        .then((res) => {
          commit('setCategoryList', res.data)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getPageDetail ({
    commit
  }, id) {
    return new Promise((resolve, reject) => {
      HelpCenterService.getPageDetail(id)
        .then((res) => {
          commit('setPageDetail', res.data)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
