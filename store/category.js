import CategoryService from '../services/category-service'

export const state = () => ({
  goodsList: [],
  'paging': {
    currentPage: 1,
    pageCount: 1,
    pageSize: 20,
    total: 1
  }
})

export const mutations = {
  // setCategoryList (state, data) {
  //   state.goodsList = data.itemList
  //   state.paging = data.paging
  // }
}

export const actions = {
  getCategoryList ({commit}, queryCondition) {
    return new Promise((resolve, reject) => {
      CategoryService.getCategoryList(queryCondition).then((res) => {
        // commit('setCategoryList', res.data.data)
        resolve(res.data)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    })
  },
  getCategoryLocation ({commit}, id) {
    return new Promise((resolve, reject) => {
      CategoryService.getCategoryLocation(id).then((res) => {
        resolve(res.data)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    })
  },
  getCategorySpecial ({commit}, id) {
    return new Promise((resolve, reject) => {
      CategoryService.getCategorySpecial(id).then((res) => {
        res.data.forEach(data => {
          if (!data.imageCover || data.imageCover === '') {
            data.imageCover = '/img/default-img.jpg'
          }
        })
        resolve(res.data)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    })
  },
  getCategorySearchCondition ({commit}, queryCondition) {
    return new Promise((resolve, reject) => {
      CategoryService.getCategorySearchCondition(queryCondition).then((res) => {
        let conditionsList = []
        const data = res.data
        if (data.brands && data.brands.length > 0) {
          conditionsList.push({
            type: 1,
            title: '品牌',
            condition: data.brands
          })
        }

        if (data.priceBounds && data.priceBounds.length > 0) {
          let priceBounds = []
          data.priceBounds.forEach((d) => {
            priceBounds.push({
              name: d,
              id: d
            })
          })
          conditionsList.push({
            type: 2,
            title: '价格',
            condition: priceBounds
          })
        }

        if (data.salesAreas && data.salesAreas.length > 0) {
          let salesAreas = []
          data.salesAreas.forEach((d) => {
            salesAreas.push({
              name: d.name,
              id: d.code
            })
          })
          conditionsList.push({
            type: 3,
            title: '产地',
            condition: salesAreas
          })
        }

        if (data.weights && data.weights.length > 0) {
          let weights = []
          data.weights.forEach((d) => {
            weights.push({
              name: d,
              id: d
            })
          })
          conditionsList.push({
            type: 4,
            title: '质量',
            condition: weights
          })
        }
        resolve(conditionsList)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    })
  }
}
